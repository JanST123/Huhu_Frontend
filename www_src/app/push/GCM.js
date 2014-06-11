Ext.define('Huhu.push.GCM', {
    extend: 'Huhu.push.Common',
    config: {
        regid: null
    },

    init: function() {

        if (Huhu.util.Config.getDebug()) {
            console.debug('INIT GCM PUSH');
        }

        if (typeof(window.plugins) != 'undefined' && typeof(window.plugins.pushNotification) != 'undefined') {
            var pushNotification = window.plugins.pushNotification;

            window.pusher=this;

            pushNotification.register(function(result) {
                if (Huhu.util.Config.getDebug()) {
                    console.debug('registered push plugin');
                }
            }, function(error) {
                if (Huhu.util.Config.getDebug()) {
                    console.debug('push plugin error' + error);
                }
            },
            {"senderID":"579244537589","ecb":"window.pusher.onNotificationGCM"});
        }
    },

    destroy: function() {
        var pushNotification = window.plugins.pushNotification;
        pushNotification.unregister(function() {
            if (Huhu.util.Config.getDebug()) {
                console.debug('unregistered push plugin');
            }

            Ext.Ajax.request({
                url: Huhu.util.Config.getApiUrl() + 'user/pushauth-set-gcm-regid',
                params: { regid: '' }
            });

        });
    },


    afterLogin: function() {
      this.init();
    },


    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    if (Huhu.util.Config.getDebug()) {
                        console.debug('GCM registered with regid: ' + e.regid);
                    }
                    this.setRegid(e.regid);
                    Huhu.util.Config.setRegid(e.regid);

                    Ext.Ajax.request({
                        url: Huhu.util.Config.getApiUrl() + 'user/pushauth-set-gcm-regid',
                        params: { regid: e.regid }
                    });
                }
                break;

            case 'message':
                if (Huhu.util.Config.getDebug()) {
                    console.debug('GCM got message');
                }
                this.processData(e.payload);
                break;

            case 'error':
                if (Huhu.util.Config.getDebug()) {
                    console.debug('GCM error = ' + e.msg);
                }
                break;

            default:
                if (Huhu.util.Config.getDebug()) {
                    console.debug('An unknown GCM event has occurred');
                }
                break;
        }
    }
});

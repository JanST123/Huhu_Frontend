Ext.define('Huhu.push.APN', {
    extend: 'Huhu.push.Common',
    config: {
        regid: null
    },

    init: function() {

        if (Huhu.util.Config.getDebug()) {
            console.debug('INIT APN PUSH');
        }

        if (typeof(window.plugins) != 'undefined' && typeof(window.plugins.pushNotification) != 'undefined') {
            var pushNotification = window.plugins.pushNotification;

            window.pusher=this;

            pushNotification.register(function(result) {
                if (Huhu.util.Config.getDebug()) {
                    console.debug('push plugin registriert');
                    console.debug('iOS APN Token: ' + result);
                }
                Huhu.util.Config.setApnToken(result);
                Ext.Ajax.request({
                    url: Huhu.util.Config.getApiUrl() + 'user/pushauth-set-apn-token',
                    params: { token: result }
                });

            }, function(error) {
                if (Huhu.util.Config.getDebug()) {
                    console.debug('apn push plugin error' + error);
                }
            },
            {
                "badge":"true",
                "sound":"true",
                "alert":"true",
                "ecb":"window.pusher.onNotificationAPN"
            });
        }
    },

    destroy: function() {

    },


    afterLogin: function() {
      this.revalidate();
    },


    revalidate: function() {
        Ext.Ajax.request({
            url: Huhu.util.Config.getApiUrl() + 'user/pushauth-set-apn-token',
            params: { token: Huhu.util.Config.getApnToken() }
        });
    },

    onNotificationAPN: function(event) {
        if (Huhu.util.Config.getDebug()) {
            console.debug('APN got message');
        }
        this.processData(event);



        if ( event.alert )
        {
            navigator.notification.alert(event.alert);
        }

        if ( event.sound )
        {
            var snd = new Media(event.sound);
            snd.play();
        }

        if ( event.badge )
        {
            pushNotification.setApplicationIconBadgeNumber(function() {}, function() {}, event.badge);
        }


    }
});

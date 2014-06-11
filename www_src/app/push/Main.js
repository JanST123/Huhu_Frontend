Ext.define('Huhu.push.Main', {
    extend: 'Huhu.push.Common',
    config: {
        transport: null
    },

    constructor: function(config) {

        Huhu.util.Config.setPusher(this);

        if (Huhu.util.Config.getDebug()) {
            console.debug('Push main init');
        }

        if (typeof(window.plugins) != 'undefined' && typeof(window.plugins.pushNotification) != 'undefined') {


            if (Huhu.util.Config.getDebug()) {
                console.debug('Push notification plugin OK - platform: ' + device.platform);
            }

            if ( device.platform == 'android' || device.platform == 'Android' ) {
                // use GoogleCloudMessaging (GCM) push transport
                this.setTransport(Ext.create('Huhu.push.GCM'));
            } else {
                // use Apple APN
                this.setTransport(Ext.create('Huhu.push.APN'));
            }
        } else if (typeof(WebSocket) != 'undefined') {
            // use websocket transport
            this.setTransport(Ext.create('Huhu.push.Websocket'));
        } else {
            if (Huhu.util.Config.getDebug()) {
                console.debug('No push plugin, no websockets :-(');
            }
            alert('Browser does not Support Websockets. You cannot use this app!');
        }




//        this.getTransport().init();

        window.pushObj=this;
        if (window.heartBeatInterval) {
          window.clearInterval(window.heartBeatInterval);
          window.heartBeatInterval=null;
        }
        window.heartBeatInterval=window.setInterval(function() {
            // tell the server we are alive
            if (!Huhu.util.Config.getAppInBackground() && Huhu.util.Config.getLoggedin()) {
                Ext.Ajax.request({
                    url: Huhu.util.Config.getApiUrl() + 'user/heartbeat'
                });
            }
        }, 30000);
    },

    destroy: function() {
      if (window.heartBeatInterval) {
        window.clearInterval(window.heartBeatInterval);
        window.heartBeatInterval=null;
      }

      this.getTransport().destroy();

      Huhu.util.Config.setPusher(null);
    }











});
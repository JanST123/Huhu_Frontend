Ext.define('Huhu.push.Websocket', {
    extend: 'Huhu.push.Common',
    config: {},
    token: null,
    websocket: null,

    revalidate: function() {
        Ext.Ajax.request({
            url: Huhu.util.Config.getApiUrl() + 'user/pushauth-generate-websocket-token',
            params: {  },
            scope: this,
            success: function(response, opts) {
                var reader=Ext.create('Ext.data.reader.Json');
                var data=reader.getResponseData(response);

                if (response.success) {
                    window.websocketObj.token=response.token;

                    window.websocketObj.websocket.send('{ "action" : "auth"; "token" : "' + this.token + '"; }');
                }
            }
        });
    },

    destroy: function() {
      console.log('destroy');

      if (window.websocketObj.websocket) {
        window.websocketNoReconnect=true;
        window.websocketObj.websocket.close();
        window.websocketObj.websocket=null;

      }
    },

    afterLogin: function() {
        this.init();
    },

    connect: function() {
        window.websocketObj.websocket=new WebSocket(Huhu.util.Config.getWebsocketUrl());
    },

    init: function() {
        this.debug('INIT WEBSOCKET PUSH');

        if (typeof(WebSocket) != 'undefined') {
            window.websocketObj=this;

            this.connect();

            this.websocket.onopen=function() {
                window.websocketObj.debug('Websocket opened!!');

                // get the websocket token from API and login onto websocket server
                Ext.Ajax.request({
                    url: Huhu.util.Config.getApiUrl() + 'user/pushauth-generate-websocket-token',
                    params: {  },
                    scope: this,
                    success: function(response, opts) {
                        var reader=Ext.create('Ext.data.reader.Json');
                        var data=reader.getResponseData(response);

                        if (data.success) {
                            window.websocketObj.token=data.token;
                            window.websocketObj.websocket.send('{ "action" : "auth", "token" : "' + window.websocketObj.token + '" }');
                        }
                    }
                });
            };

            this.websocket.onclose=function() {
                window.websocketObj.debug('Websocket closed!');

                if (typeof(window.websocketNoReconnect) == 'undefined' || !window.websocketNoReconnect) {
                  // retry
                  window.setTimeout(function() {
                      window.websocketObj.init();
                  }, 1000);
                }
                window.websocketNoReconnect=null;

            }

            this.websocket.onerror=function(e, f) {
                window.websocketObj.debug(['Websocket error!', e, f]);
            }

            this.websocket.onmessage=this.onMessage;



        }

    },

    onMessage: function(event) {
        try {
            var reader=Ext.create('Ext.data.reader.Json');
            var message=reader.getResponseData(event.data);
            if (message.action=='auth') {
                if (message.status=='ok') {
                    // successfully logged in
                } else {
                    window.websocketObj.debug(['WEBSOCKET AUTH ERROR', message]);
                }
            } else {
                window.websocketObj.processData(event.data);
            }
        } catch (e) {
            window.websocketObj.debug(['EXCEPTION WHILE PARSING JSON', e]);
        }
    }
});

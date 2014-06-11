Ext.define('Huhu.util.Config', {
    singleton : true,
    alias : 'widget.appConfigUtil',
    config : {
        activeChatId: null,
        activeNavigationView: null,
        apiUrl: 'https://we-hu.hu/api/',
        apnToken: null,
        appInBackground: 0,
        debug: true,
        language: 'de',
        languageDefault: 'de',
        loggedin: false,
        pageUrl: 'https://we-hu.hu',
        privateKey: null,
        pusher: null,
        regid: null,
        userid: null,
        websocketUrl: 'wss://we-hu.hu:8400'
    },
    constructor: function(config) {
        this.initConfig(config);
        this.callParent([config]);
    }
});
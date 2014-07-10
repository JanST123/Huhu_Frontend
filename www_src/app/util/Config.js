Ext.define('Huhu.util.Config', {
    singleton : true,
    alias : 'widget.appConfigUtil',
    config : {
        activeChatId: null,
        activeNavigationView: null,
        apiUrl: 'http://localhost/huhu/api/',
        apnToken: null,
        appInBackground: 0,
        debug: true,
        language: 'de',
        languageDefault: 'de',
        loggedin: false,
        pageUrl: 'http://localhost/huhu_app/www_src',
        privateKey: null,
        pusher: null,
        regid: null,
        userid: null,
        websocketUrl: 'ws://localhost:8400'
    },
    constructor: function(config) {
        this.initConfig(config);
        this.callParent([config]);
    }
});
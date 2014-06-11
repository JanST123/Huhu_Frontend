Ext.define('Huhu.view.Chats', {
	extend: 'Ext.navigation.View',
	xtype: 'chatscontainer',
	requires: [
	           'Huhu.view.Chat',
	           'Huhu.view.ChatList'
	       ],
	config: {
		title: 'Chats',
		defaultBackButtonText: 'Zurück',
		autoDestroy: false,
		items: [
		        { xtype: 'chatslist' }
		],
		listeners: {
			 show: function() {
		        Huhu.util.Config.setActiveNavigationView(Ext.ComponentQuery.query('chatscontainer')[0]);
		     }
		}
	}
});

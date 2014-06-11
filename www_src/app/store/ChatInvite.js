Ext.define('Huhu.store.ChatInvite', {
	extend: 'Ext.data.Store',
	config: {
		model: 'Huhu.model.Contact',
		groupDir: 'DESC',
		sorters: ['sort'],
		proxy: {
			type: 'ajax',
			url: Huhu.util.Config.getApiUrl() + 'contacts/get-invitable/format/html',
			reader: {
				type: 'json',
				rootProperty: 'contacts',
				successProperty: 'success'
			}
		},
		listeners: {
			beforeload: function(store, operation, opts) {
				var chatinvitecontainer=Ext.ComponentQuery.query('chatinvite');
				if (chatinvitecontainer.length > 0) {
					chatinvitecontainer=chatinvitecontainer[0];
					var data=chatinvitecontainer.getData();
					if (typeof(data)=='object' && typeof(data.chatid) != 'undefined') {
						store.getProxy().setExtraParam('chatid', data.chatid);
						return;
					}
				}
				store.getProxy().setExtraParam('chatid', null);
			}
		},
		autoLoad: false // load triggered in afterLogin() Method in util.User
	}
});
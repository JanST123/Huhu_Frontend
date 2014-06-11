Ext.define('Huhu.store.Chats', {
	extend: 'Ext.data.Store',
	config: {
		model: 'Huhu.model.Chat',
		proxy: {
			type: 'ajax',
			url: Huhu.util.Config.getApiUrl() + 'chat/get-open',
			reader: {
				type: 'json',
				rootProperty: 'chats',
				successProperty: 'success'
			}

		},

		autoLoad: false // load triggered in afterLogin() Method in util.User
	},
    listeners: {
        load: function(store, records, success, op, eopts) {
            for (var x in records) {
                var lastmessage=records[x].get('lastUnreadMsg');
                if (!Ext.isEmpty(lastmessage)) {
                    records[x].set('lastUnreadMsg', Huhu.util.Chat.messageDecode(lastmessage));
                }
            }

            return records;
        }
    }
});
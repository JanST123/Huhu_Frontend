Ext.define('Huhu.store.ContactsInvisible', {
	extend: 'Ext.data.Store',
	config: {
		model: 'Huhu.model.Contact',
		groupDir: 'ASC',
		grouper: {
		    groupFn: function(record) {
		        return record.get('name');
		    }
		},
		sorters: ['sort'],
		proxy: {
			type: 'ajax',
			url: Huhu.util.Config.getApiUrl() + 'contacts/get-invisible/format/html',
			reader: {
				type: 'json',
				rootProperty: 'contacts',
				successProperty: 'success'
			}
		},
		autoLoad: false // load triggered in afterLogin() Method in util.User
	}
});
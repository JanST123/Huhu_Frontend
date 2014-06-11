Ext.define('Huhu.store.ContactsVisible', {
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
			url: Huhu.util.Config.getApiUrl() + 'contacts/get-visible/format/html',
			reader: {
				type: 'json',
				rootProperty: 'contacts',
				successProperty: 'success'
			}
		},
		autoLoad: false // remember to trigger load in afterLogin() method in util.User
	}
});
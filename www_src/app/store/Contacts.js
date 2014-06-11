Ext.define('Huhu.store.Contacts', {
	extend: 'Ext.data.Store',
	config: {
		model: 'Huhu.model.Contact',
		groupDir: 'DESC',
		grouper: {
		    groupFn: function(record) {
		        return record.get('type');
		    }
		},
		sorters: ['sort'],
		proxy: {
			type: 'ajax',
			url: Huhu.util.Config.getApiUrl() + 'contacts/get/format/html',
			reader: {
				type: 'json',
				rootProperty: 'contacts',
				successProperty: 'success'
			}
		},
		autoLoad: false // load triggered in afterLogin() Method in util.User
	}
});
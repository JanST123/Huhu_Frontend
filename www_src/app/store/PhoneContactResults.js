Ext.define('Huhu.store.PhoneContactResults', {
	extend: 'Ext.data.Store',
	config: {
		model: 'Huhu.model.ContactSearchResult',
		autoLoad: true
	}
});
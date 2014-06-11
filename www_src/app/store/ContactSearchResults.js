Ext.define('Huhu.store.ContactSearchResults', {
	extend: 'Ext.data.Store',
	config: {
		model: 'Huhu.model.ContactSearchResult',
		autoLoad: true
	}
});
Ext.define('Huhu.view.ContactSearchResultList', {
	extend: 'Ext.List',
	xtype: 'contactsearchresultlist',
	config: {
		flex: 1,
		title: 'Suchergebnisse',
		itemTpl: '<img src="data:image/jpg;base64,{picture}" />&nbsp;{name}&nbsp;<br />'
			 +'<div class="searchResultAdditionalInfo">{additionalInfo}</div>',
		store: 'ContactSearchResults',
		onItemDisclosure: true
	}
});
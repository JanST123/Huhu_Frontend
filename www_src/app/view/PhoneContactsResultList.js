Ext.define('Huhu.view.PhoneContactsResultList', {
	extend: 'Ext.List',
	xtype: 'phonecontactresultlist',
	config: {
		flex: 1,
		title: 'Diese Kontakte kennen Sie evtl....',
		itemTpl: '<img src="data:image/jpg;base64,{picture}" />&nbsp;{name}&nbsp;<br />'
			 +'<div class="searchResultAdditionalInfo">{additionalInfo}</div>',
		store: 'PhoneContactResults',
		onItemDisclosure: true
	}
});
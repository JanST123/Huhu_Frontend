Ext.define('Huhu.view.ContactList', {
	extend: 'Ext.List',
	xtype: 'contactlist',
	config: {
		cls: 'contactlist',
		flex: 1,
		emptyText: 'Du hast keine Kontakte in der Liste, füge jetzt neue hinzu!',
		grouped: true,
		title: 'Kontakte',
		itemTpl: '<img src="data:image/jpg;base64,{picture}" />&nbsp;{name}&nbsp;<br />'
				 +'<div class="contactListStatus">{status}</div>',
		store: 'Contacts',
		scrollable: 'vertical',
		onItemDisclosure: true
	}
});
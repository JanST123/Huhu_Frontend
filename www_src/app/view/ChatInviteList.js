Ext.define('Huhu.view.ChatInviteList', {
	extend: 'Ext.List',
	xtype: 'chatinvitelist',
	config: {
		cls: 'chatinvitelist',
		flex: 1,
		emptyText: 'Aktuell stehen keine Kontakte zum einladen bereit!',
		mode: 'MULTI',
		title: 'Zum Gruppenchat einladen',
		itemTpl: '<img src="data:image/jpg;base64,{picture}" />&nbsp;{name}&nbsp;<br />'
				 +'<div class="contactListStatus">{status}</div>',
		store: 'ChatInvite',
		scrollable: 'vertical',
		listeners: {
			initialize: function(that, newActiveItem, oldActiveItem, opts) {
				that.getStore().load();
			}
		}
	}
});
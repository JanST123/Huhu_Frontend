Ext.define('Huhu.view.Logout', {
	extend: 'Ext.Panel',
	xtype: 'logoutpanel',
	config: {
		title: 'Logout',
		styleHtmlContent: true,
		scrollable: 'vertical',
		items: [
		       { html: '<strong>Wirklich ausloggen?</strong><br />' },
		       {
                   xtype: 'button',
                   itemId: 'logoutbutton',
                   ui: 'decline',
                   text: 'Logout',
                   iconCls: 'delete'
               }
		       
		]
		
	}
})

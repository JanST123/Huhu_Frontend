Ext.define('Huhu.view.Contacts', {
	extend: 'Ext.navigation.View',
	xtype: 'contactscontainer',
	requires: [
	           'Huhu.view.ContactList',
	           'Huhu.view.ContactSearch',
	           'Huhu.view.ContactSearchResultList'
	       ],
	config: {
		title: 'Kontakte',
		defaultBackButtonText: 'Zurück',
		items: [
		        {
		        	xtype: 'panel',
		        	title: 'Kontakte',
		        	layout: {
		        		type: 'vbox',
		        		align: 'stretch'
		        	},
		        	items: [
		        	        	{ html: '<br />' },
		        	        	{ 
		        	        		xtype: 'container',
		        	        		layout: 'hbox',
		        	        		items: [
										{
											xtype: 'button',
											text: 'Kontakt hinzufügen',
											flex: 1,
										    ui: 'action',
										    iconCls: 'add',
										    itemId: 'newcontactbutton',
										    margin: '0 10px 0 0'
										},
										{
											xtype: 'button',
											text: 'Gruppenchat starten',
											flex: 1,
										    ui: 'action',
										    iconCls: 'team',
										    itemId: 'newgroupchatbutton',
										    margin: '0 0 0 10px'
										}
		        	        		]
		        	        	},
								
								{ html: '<br />' },
								{ xtype: 'contactlist' }			
		        	]
		        }
		],
		listeners: {
			 show: function() {
				 Huhu.util.Config.setActiveNavigationView(Ext.ComponentQuery.query('contactscontainer')[0]);
			 }
		}
	}
});

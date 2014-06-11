Ext.define('Huhu.controller.Contacts', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			main: 'contactscontainer',
			contactslist: 'contactlist'
		},
		control: {
			'component[itemId=newcontactbutton]': {
				tap: 'openSearchContact'
			},
			'component[itemId=newgroupchatbutton]': {
				tap: 'openChatInvite'
			}
		}
	},
	
	openSearchContact: function() {
       	this.getMain().push({
       		xtype: 'contactsearch',
       		title: 'Kontakte suchen und hinzufügen'
       	});
	},
	
	openChatInvite: function() {
		var mainpanel=this.getMain();
		mainpanel.push({
       		xtype: 'chatinvite',
       		data: {},
       		title: 'Zum Gruppenchat einladen'
       	});
	}
	

	
	
});


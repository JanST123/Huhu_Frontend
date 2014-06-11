Ext.define('Huhu.controller.ContactSearch', {
	extend: 'Ext.app.Controller',
	initialContactSearchDone: false,
	
	config: {
		refs: {
			contactsearch: 'contactsearch',
			contactsearchresultlist: 'contactsearchresultlist',
			phonecontactresults: 'component[itemId=phoneContactResults]',
			phonecontactresultsheadline: 'component[itemId=phoneContactResultsHeadline]',
			contactsearchform: 'component[itemId=contactsearchform]',
			contactscontainer: 'contactscontainer',
			searchbutton: 'component[itemId=searchbutton]'
		},
		control: {
			searchbutton: {
				tap: 'doContactSearch'
			},
			contactsearchresultlist: {
				disclose: 'addContact'
			},
			phonecontactresults: {
				disclose: 'addContact'
			},
			contactsearch: {
				show: function() {
					if (this.initialContactSearchDone==true) return; // do only one
					
					var that=this;

					
					if (typeof(navigator) != 'undefined' && typeof(navigator.contacts) != 'undefined') {
						var contactFields=["displayName", "name", "nickname", "phoneNumbers", "emails", "addresses", "ims", "organizations", "birthday", "urls"];
						
						
						navigator.contacts.find(contactFields, function(contacts) {
							// send the whole shit over to the API and do the work there...
							Ext.Ajax.request({
								url: Huhu.util.Config.getApiUrl() + 'contacts/sync-with-phone-adressbook',
								params: { contacts: Ext.JSON.encode(contacts) },
								method: 'POST',
								scope: this,
								success: function(response, options) {

									var reader=Ext.create('Ext.data.reader.Json');
						        	var data=reader.getResponseData(response);
						        	
						        	if (data.success && data.foundcount > 0) {
										var list=that.getPhonecontactresults().getStore().setData(data.results);
										that.getPhonecontactresults().refresh();
										that.getPhonecontactresults().show();
										that.getPhonecontactresultsheadline().show();
						        	}
								}
							});
							
						}, function(error) {
							// pssssst....!
						}, {
							filter: "",
							multiple: true
						});
						
					}
				}
			}
		}
	},

	
	
	addContact: function(list, record) {
		var that=this;
		Ext.Msg.show({
			title: 'Kontakt hinzufügen', 
			message: 'Soll ' + record.data.name + ' zu deiner Kontaktliste hinzugefügt werden? ' + record.data.name + ' erhält dann noch eine Aufforderung dies zu bestätigen - Danach könnt ihr chatten!',
			buttons: [
				{ text: 'Ja, hinzufügen', itemId: 'yes' },
				{ text: 'Nein, Zurück', itemId: 'no' }
			],
			fn: function(buttonId, value, opt) {
				if (buttonId=='yes') {
					Ext.Ajax.request({
						url: Huhu.util.Config.getApiUrl() + 'contacts/add',
						params: { userid: record.data.id },
						success: function(response, opts) {
							var reader=Ext.create('Ext.data.reader.Json');
				        	var data=reader.getResponseData(response);
				        	if (data.success) {
				        		Ext.Msg.alert('Hinzugefügt', data.message);
				        		
				        		// refresh contact list
				        		var contactlist=Ext.ComponentQuery.query('contactlist');
			           			contactlist[0].getStore().load();
			           			contactlist[0].refresh();
			           			
			           			// go home in navigation view (contactscontainer)
			           			that.getContactscontainer().pop(2);
				        	}
						}
					});
				}
			}
		});
	},
	
	
	doContactSearch: function() {
		var that=this;
		this.getContactsearchform().submit({
			success: function(opt, data) {
				if (data.success) {
					if (data.foundcount > 0) {
						that.getContactscontainer().push({
							xtype: 'contactsearchresultlist'
						});
						
						var list=that.getContactsearchresultlist().getStore().setData(data.results);		
					} else {
						Ext.Msg.alert('Kein Ergebnis', data.message);
					}
				}
			}
		});
	}
	
	
});


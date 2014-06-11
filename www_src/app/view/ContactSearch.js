Ext.define('Huhu.view.ContactSearch', {
    extend: 'Ext.Panel',
    xtype: 'contactsearch',    
    requires: [
               'Huhu.view.SearchAdditionalFields'
              ],
	config: {
		styleHtmlContent: true,
		scrollable: 'vertical',
		layout: 'card',
		items: [
                {
                    title: 'Kontakte suchen und hinzufügen',
                    xtype: 'formpanel',
                    url: Huhu.util.Config.getApiUrl() + 'contacts/search',
                    layout: 'vbox',
                    itemId: 'contactsearchform',
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Kontaktsuche',
                            instructions: '(Bitte gebe die Details ein, mit denen du den Kontakt finden möchtest. Mit mehr Details kannst du das Suchergebnis verfeinern.)',
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Benutzername',
                                    name:  'username'
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            text: 'Detailiert suchen',
                            iconCls: 'more',
                            itemId: 'moredetailsbutton',
                            handler: function() {
                            	Ext.ComponentQuery.query('searchAdditionalFields')[0].show();
                            	this.hide();
                            }
                        },
                        {
                        	xtype: 'searchAdditionalFields',
                        	hidden: true
                        },
                        {
                        	html: '<br />'
                        },
                        {
                            xtype: 'button',
                            text: 'Suche starten',
                            ui: 'confirm',
                            iconCls: 'search',
                            itemId: 'searchbutton'
                        },
                        {
                        	html: '<br /><h4>Diese Kontakte kennst du vielleicht...</h4>',
                        	hidden: true,
                        	itemId: 'phoneContactResultsHeadline'
                        },
                        {
                        	xtype: 'list',
                        	flex: 1,
                        	hidden: true,
                        	itemId: 'phoneContactResults',
                        	itemTpl: '<img src="data:image/jpg;base64,{picture}" />&nbsp;{name}&nbsp;<br />'
                   			 		+'<div class="searchResultAdditionalInfo">{additionalInfo}</div>',
                   			 store: 'PhoneContactResults',
                   			 onItemDisclosure: true
                        }
                    ]
                }
            ]
	}
});

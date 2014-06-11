Ext.define('Huhu.view.Signup', {
    extend: 'Ext.form.Panel',
    xtype: 'signuppanel',
    requires: [
	           'Huhu.view.ProfileAdditionalFields',
	           'Huhu.model.validation.Signup'
	       ],
    
	config: {
		styleHtmlContent: true,
		scrollable: 'vertical',
		url: Huhu.util.Config.getApiUrl() + 'user/signup',
		title: 'Registrieren',
		itemId: 'signupform',
		layout: 'vbox',
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Registrierung',
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Neuer Benutzername',
                                    name:  'username',
                                    required: true
                                },
                                {
                                    xtype: 'emailfield',
                                    label: 'E-Mail Adresse',
                                    name:  'email',
                                    required: true
                                },
                                {
                                    xtype: 'togglefield',
                                    label: 'E-Mail Adresse sichtbar?',
                                    name:  'emailpublictoggle',
                                    listeners: {
                                       change: function(field, newValue) {
                                    	   Ext.ComponentQuery.query('component[itemId=emailpublic]')[0].setValue(newValue);
                                       }           
                                    }
                                },
                                {
                                	xtype: 'hiddenfield',
                                	name: 'emailpublic',
                                	itemId: 'emailpublic'
                                },
                                {
                                    xtype: 'passwordfield',
                                    label: 'Neues Passwort',
                                    name:  'password',
                                    required: true
                                },
                                {
                                    xtype: 'passwordfield',
                                    label: 'Neues Passwort wiederholen',
                                    name:  'password2',
                                    required: true
                                },
                                {
                                	xtype: 'togglefield',
                                	label: 'Eingeloggt bleiben (auf diesem Gerät)',
                                	name: 'keep_loggedin_toggle',
                                    listeners: {
                                        change: function(field, newValue) {
                                     	   Ext.ComponentQuery.query('component[itemId=keep_loggedin2]')[0].setValue(newValue);
                                        }           
                                     }
                                },
                                {
                                	xtype: 'hiddenfield',
                                	itemId: 'keep_loggedin2',
                                	name: 'keep_loggedin'
                                }
                                
                            ]
                        },
                        {
                        	xtype: 'profileAdditionalFields'
                        },
                        {
                            xtype: 'button',
                            text: 'Registrierung absenden',
                            ui: 'confirm',
                            iconCls: 'arrow_right',
                            itemId: 'signupdobutton'
                            
                        }
                    ]
	}
});

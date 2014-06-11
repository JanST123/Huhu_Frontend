Ext.define('Huhu.view.Login', {
    extend: 'Ext.navigation.View',
    xtype: 'loginpanel',
    requires: [
               'Huhu.model.validation.Login'
    ],
	config: {
		styleHtmlContent: true,
		scrollable: 'vertical',
		defaultBackButtonText: 'Zurück',
		listeners: {
  		    show: function() {
  			   Huhu.util.Config.setActiveNavigationView(Ext.ComponentQuery.query('loginpanel')[0]);
		    },
		    
			painted: function() {
					el = Ext.get("forgotPassword");
					el.on({
						tap: function() {
							Ext.Msg.show({
								title: 'Passwort neu setzen?', 
								message: 'Hast du wirklich dein Passwort vergessen, und möchtest dass wir dir ein neues Passwort erstellen?<br />Das neue Passwort erhälst du dann an deine E-Mail Adresse.',
								buttons: [
									{ text: 'Nein, Abbruch', itemId: 'no' },
									{ text: 'Ja, ich will ein neues Passwort', itemId: 'yes' }
								],
								fn: function(buttonId, value, opt) {
									if (buttonId=='yes') {
										var username=Ext.ComponentQuery.query("#loginUsername")[0].getValue();
										if (username=='') {
											Ext.Msg.alert('Benutzername??', 'Bitte gebe vorher deinen Benutzernamen an!');
											return;
										}
										
										
										Ext.Ajax.request({
											url: Huhu.util.Config.getApiUrl() + 'user/reset-password',
											params: { username: username },
											success: function(response, opts) {
												var reader=Ext.create('Ext.data.reader.Json');
									        	var data=reader.getResponseData(response);
									        	if (data.success) {
									        		Ext.Msg.alert('Ok', data.message);
									        	}
											}
										});
									} 
								}
							});
						}
					});
			}
		},
		items: [
                {
                    title: 'Login oder Registrieren',
                    xtype: 'formpanel',
                    url: Huhu.util.Config.getApiUrl() + 'user/login',
                    layout: 'vbox',
                    itemId: 'loginform',

                    items: [
                        { html: '<br />' },
                        {
                        	xtype: 'button',
                            text: 'Registrieren',
                            iconCls: 'add',
                            ui: 'action',
                            itemId: 'signupbutton'
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Login',
                            instructions: '(Bitte gebe deinen Benutzernamen und dein Passwort ein, oder klicke auf Registrieren um einen Zugang zu erstellen) <a href="javascript:void(0);" id="forgotPassword">Passwort vergessen?</a>',
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Benutzername',
                                    name:  'username',
                                    itemId: 'loginUsername',
                                    required: true
                                },
                                {
                                    xtype: 'passwordfield',
                                    label: 'Passwort',
                                    name:  'password',
                                    required: true
                                },
                                {
                                	xtype: 'togglefield',
                                	label: 'Eingeloggt bleiben (auf diesem Gerät)',
                                	name: 'keep_loggedin_toggle',
                                    listeners: {
                                        change: function(field, newValue) {
                                     	   Ext.ComponentQuery.query('component[itemId=keep_loggedin]')[0].setValue(newValue);
                                        }           
                                     }
                                },
                                {
                                	xtype: 'hiddenfield',
                                	itemId: 'keep_loggedin',
                                	name: 'keep_loggedin'
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            text: 'Login',
                            ui: 'confirm',
                            iconCls: 'arrow_right',
                            itemId: 'loginbutton'
                        }
                    ]
                }
            ]
	}
});

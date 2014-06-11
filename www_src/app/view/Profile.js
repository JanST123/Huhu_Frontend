Ext.define('Huhu.view.Profile', {
    extend: 'Ext.form.Panel',
    xtype: 'profilepanel',
    requires: [
	           'Huhu.view.ProfileAdditionalFields',
	           'Huhu.model.validation.Profile'
	       ],
    
	config: {
		styleHtmlContent: true,
		scrollable: 'vertical',
		url: Huhu.util.Config.getApiUrl() + 'user/profile-update',
		title: 'Profil ändern',
		itemId: 'profileform',
		layout: 'vbox',
                    items: [
						{
						    xtype: 'fieldset',
						    title: 'Benutzerbild',
						    layout: 'hbox',
						    items: [
						           {
										xtype: 'image',
										itemId: 'profileImage',
										src: Huhu.util.Config.getApiUrl() + 'img/defaultUserPic.jpg',
										style: 'border: 4px outset gray; margin: 2px;',
										height: 64,
										width: 64,
										listeners: {
											tap: function(imageButton) {
												if (typeof(navigator) != 'undefined' && typeof(navigator.camera) != 'undefined') {
													// we are the app and can use the camera
													
													Huhu.util.Image.uploadImage(
															Huhu.util.Config.getApiUrl() + 'user/upload-profile-pic-file',
															{}, 
															64, 
															64, 
															function(response) {
																var reader=Ext.create('Ext.data.reader.Json');
						    				        	        var data=reader.getResponseData(response.response);

						    				        	        if (data.success) {
						    				        	        	Huhu.util.User.placeUsernameAndPic();

						    				        	        	// image uploaded
						    				        	        	Ext.ComponentQuery.query('component[itemId=profileImage]')[0].setSrc('data:image/jpg;base64,' + data.src);
						    				        	        }
															},
															function(e) {
																alert(e.message);
															}
													);
												} else {
													// we are the website and need to open an upload dialog
													overlay = Huhu.util.Overlay.show('profileUploadDialogOverlay', 'Profilbild hochladen', [
                                                        {
                                                            docked: 'top',
                                                            xtype: 'toolbar',
                                                            title: 'Profilbild hochladen'
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            items: [
                                                                {
                                                                    html: '<h3>Du kannst nun eine Bilddatei von deinem Computer auswählen und hochladen. Das Bild wird von uns geprüft und dir bei erfolgreicher Prüfung als Profilbild zugewiesen.</h3>'
                                                                },
                                                                {
                                                                    xtype: 'formpanel',
                                                                    style: 'height: 130px',
                                                                    itemId: 'profilepicuploadform',
                                                                    id: 'profilepicuploadform',
                                                                    listeners: {
                                                                        painted: function(form, opts) {
                                                                            form.set({ enctype: 'multipart/form-data' });
                                                                        }
                                                                    },
                                                                    items: [
                                                                        {
                                                                            xtype: 'fieldset',
                                                                            title: 'Profilbild hochladen',
                                                                            items: [
                                                                                {
                                                                                    html: '<label for="profilepic_file">Datei aussuchen: </label>'
                                                                                        + '<input type="file" name="file" id="profilepic_file" accept="image/*" />'

                                                                                },
                                                                                {
                                                                                    html: '<br />'
                                                                                },
                                                                                {
                                                                                    xtype: 'button',
                                                                                    text: 'Upload',
                                                                                    ui: 'confirm',
                                                                                    iconCls: 'arrow_up',
                                                                                    itemId: 'profilepicuploadbutton'
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ], true);


													
													
													overlay.showBy(imageButton);
													
													
												}
											}
										}
						           },
						           { 
						        	   xtype: 'panel',
						        	   flex: 2,
						        	   html: '<div style="padding-left: 8px; vertical-align: middle; height: 100%;"><span style="position: absolute; top: 50%; margin-top: -10px;">Tippe auf dein Benutzerbild um es zu ändern</span></div>'
						           }
						     ]
						},
                        {
                            xtype: 'fieldset',
                            title: 'Profil',
                            items: [
								{
								    xtype: 'hiddenfield',
								    name:  'username'
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
                                }
                             ]
                        },
                        {
                        	xtype: 'fieldset',
                        	title: 'Passwort ändern',
                        	instructions: 'Nur ausfüllen wenn Du dein aktuelles Passwort ändern möchtest!',
                        	items: [
                                    {
                                        xtype: 'passwordfield',
                                        label: 'Aktuelles Passwort',
                                        name:  'passwordold'
                                    },
                        	        {
                                        xtype: 'passwordfield',
                                        label: 'Neues Passwort',
                                        name:  'password'
                                    },
                                    {
                                        xtype: 'passwordfield',
                                        label: 'Neues Passwort wiederholen',
                                        name:  'password2'
                                    }
                        	]
                        },
                        {
                        	xtype: 'profileAdditionalFields'
                        },
                        {
                            xtype: 'button',
                            text: 'Daten speichern',
                            ui: 'confirm',
                            iconCls: 'arrow_right',
                            itemId: 'profilechangedobutton'
                            
                        }
                    ]
	}
});

Ext.define('Huhu.view.SearchAdditionalFields', {
    extend: 'Ext.form.FieldSet',
    xtype: 'searchAdditionalFields',
    
    config: {
    	title: 'Zusätzliche Angaben',
    	instructions: 'Damit kann das Suchergebnis verfeinert werden',
        items: [
            {
            	xtype: 'container',
            	layout: 'hbox',
            	items: [
                        {
                            xtype: 'selectfield',
                            label: 'Nach einem Detail suchen',
                            itemId: 'additionalfieldselector',
                            name:  'field',
                            autoSelect: false,
                            placeHolder: 'Tippen zum auswählen',
                            options: [
                                  { text: 'Tippen zum auswählen', value: '' },
                                  { text: 'Alter', value: 'age', fieldType: 'int' },
                                  { text: 'E-Mail Adresse', value: 'email', fieldType: 'email' },
                                  { text: 'Firma', value: 'company', fieldType: 'string' },
                                  { text: 'Geburtstag', value: 'birthday', fieldType: 'date' },
                                  { text: 'Handynummer', value: 'mobile', fieldType: 'phone' },
                                  { text: 'Mädchenname', value: 'girlsname', fieldType: 'string' },
                                  { text: 'Nachname', value: 'lastname', fieldType: 'string' },
                                  { text: 'Name der letzten Schule', value: 'lastschool', fieldType: 'string' },
                                  { text: 'Postleitzahl', value: 'zip', fieldType: 'int' },
                                  { text: 'Telefonnummer', value: 'phone', fieldType: 'phone' },
                                  { text: 'Vorname', value: 'firstname', fieldType: 'string' },
                                  { text: 'Webseite', value: 'url', fieldType: 'url' },
                                  { text: 'Wohnort', value: 'city', fieldType: 'string' }
                            ],
                            flex: 1
                        },
                        {
                            xtype: 'button',
                            ui: 'action',
                            iconCls: 'add',
                            itemId: 'addAdditionalField',
                            width: 40,
                            handler: function(button, event) {
                            	var parentContainer=button.element.parent('.x-container');
                            	parentContainer=Ext.ComponentQuery.query('#' + parentContainer.id);
                            	
                            	var additionalFieldSet=Ext.ComponentQuery.query('searchAdditionalFields');
                            	additionalFieldSet=additionalFieldSet[0];
                            	
                            	var selector=Ext.ComponentQuery.query('#additionalfieldselector', parentContainer[0]);
                            	var record=selector[0].getRecord();
                            	if (typeof(record) != 'undefined' && typeof(record.raw) != 'undefined') {
                            		var data=record.raw;
                            		if (data.value!='') {
                            			
                            			var newField={
                                    		label: data.text,
                                    		name: 'additional[' + data.value + ']'
                            			};
                            			
                            			switch(data.fieldType) {
                            				case 'string':
                            					// simple textfield
                            					newField.xtype='textfield';
                            					break;
                            					
                            				case 'int':
                            					// simple numberfield
                            					newField.xtype='numberfield';
                            					break;
                            					
                            				case 'email':
                            					// simple emailfeld
                            					newField.xtype='emailfield';
                            					break;
                            					
                            				case 'date':
                            					newField.xtype='datepickerfield';
                            					newField.dateFormat='d.m.Y';
                            					break;
                            					
                            				case 'phone':
                            					additionalFieldSet.add({
                            						xtype: 'container',
                            		            	layout: 'hbox',
                            		            	items: [
                            		            	        {
                            		            	        	xtype: 'textfield',
                                        						placeHolder: 'Land',
                                        						label: data.text,
                                        						name: 'additional[' + data.value + ']' + '[]',
                                        						value: '+49',
                                        						style: 'border: 2px solid #F5F6F6;',
                                        						flex: 1
                            		            	        },
                            		            	        {
                                        						xtype: 'numberfield',
                                        						placeHolder: 'Vorwahl',
                                        						name: 'additional[' + data.value + ']' + '[]',
                                        						style: 'border: 2px solid #F5F6F6;',
                                        						flex: 2
                                        					},
                            		            	        {
                                        						xtype: 'numberfield',
                                        						placeHolder: 'Nummer',
                                        						name: 'additional[' + data.value + ']' + '[]',
                                        						style: 'border: 2px solid #F5F6F6;',
                                        						flex: 3
                                        					}
                            		            	]
                            		            	
                            						
                            					});
                            					
                            					newField=null;
                            					break;
                            					
                            				case 'url':
                            					newField.xtype='urlfield';
                            					break;
                            					
                            				default:
                            					return;
                            			}
                            			
                            			if (newField) {
                            				additionalFieldSet.add(newField);
                            			}
                            			
                            			// remove from selectbox
                            			var options=selector[0].getOptions();
                            			var optionsNew=[];
                            			for (var x in options) {
                            				if (options[x].value!=data.value) {
                            					optionsNew.push(options[x]);
                            				}
                            			}
                            			selector[0].setOptions(optionsNew);
                            			selector[0].updateOptions(optionsNew);
                            		}
                            	}
                            }
                        }
            	 ]
            }
        ]
    }
});
    	
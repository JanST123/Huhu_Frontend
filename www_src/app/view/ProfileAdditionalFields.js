Ext.define('Huhu.view.ProfileAdditionalFields', {
    extend: 'Ext.form.FieldSet',
    xtype: 'profileAdditionalFields',
    requires: [
	           'Huhu.model.validation.AdditionalFields'
	       ],


	       
    config: {
    	title: 'Zusätzliche (freiwillige) Angaben',
    	instructions: 'Diese Angaben erleichtern deinen Freunden dich hier zu finden',
        items: [
            {
            	xtype: 'container',
            	layout: 'hbox',
            	items: [
                        {
                            xtype: 'selectfield',
                            label: 'Ein Detail zu dir hinzufügen',
                            itemId: 'additionalfieldselector',
                            name:  'field',
                            autoSelect: false,
                            placeHolder: 'Tippen zum auswählen',
                            options:  [
                   	            	{ text: 'Tippen zum auswählen', value: '' },
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
                            	
                            	var additionalFieldSet=Ext.ComponentQuery.query('profileAdditionalFields');
                            	additionalFieldSet=additionalFieldSet[0];
                            	
                            	var selector=Ext.ComponentQuery.query('#additionalfieldselector', parentContainer[0]);
                            	var record=selector[0].getRecord();
                            	
                            	if (typeof(record) != 'undefined' && typeof(record.raw) != 'undefined') {
                            		additionalFieldSet.addAdditionalField(parentContainer, record.raw);
                            	}
                            }
                        }
            	 ]
            }
        ]
    },
    

    /**
     * add an additional field
     * @param HTMLElement parentContainer
     * @param Object data
     * @return Void
     */
    addAdditionalField: function(parentContainer, data) {
   		if (data.value!='') {
  			var newField={
           		label: data.text,
           		name: 'additional[' + data.value + ']'
   			};
  			
  			if (typeof(data.fieldValue) != 'undefined') {
  				newField.value=data.fieldValue;
  			}
    			
   			switch(data.fieldType) {
   				case 'string':
   					// simple textfield
   					newField.xtype='textfield';
   					break;
    					
   				case 'int':
   					// simple numberfield
   					newField.xtype='textfield'; // yes, there is a numberfield, but we validate by our own
   					break;
    					
   				case 'email':
   					// simple emailfeld
   					newField.xtype='emailfield';
   					break;
    					
   				case 'date':
   					if (typeof(newField.value) != 'undefined') {
   						var split=newField.value.split('T')[0].split('-');
   						newField.value={
   								day: split[2],
   								month: split[1],
   								year: split[0]
   						};
   					}
   					
   					newField.xtype='datepickerfield';
   					newField.dateFormat='d.m.Y';
   					break;
    					
   				case 'phone':
   					value=[
   					  "+49",
   					  "",
   					  ""
   					];
   					if (typeof(newField.value) != 'undefined') {
   						var value=newField.value.split(';');
   					}
   					this.add({
   						xtype: 'container',
   		            	layout: 'hbox',
   		            	items: [
   		            	        {
   		            	        	xtype: 'textfield',
               						placeHolder: 'Land',
               						label: data.text,
               						name: 'additional[' + data.value + ']' + '[]',
               						value: value[0],
               						style: 'border: 2px solid #F5F6F6;',
               						flex: 1
   		            	        },
   		            	        {
               						xtype: 'textfield',
               						placeHolder: 'Vorwahl',
               						name: 'additional[' + data.value + ']' + '[]',
               						value: value[1],
               						style: 'border: 2px solid #F5F6F6;',
               						flex: 2
               					},
   		            	        {
               						xtype: 'textfield',
               						placeHolder: 'Nummer',
               						name: 'additional[' + data.value + ']' + '[]',
               						value: value[2],
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
   				this.add(newField);
   			}
    			
   			// remove from selectbox
   			var selector=Ext.ComponentQuery.query('#additionalfieldselector', parentContainer[0]);
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
    },
    
    /**
     * validates the additional fields if given in the form
     * @param Ext.Form.FormPanel formObj
     * @return boolean isValid
     */
    validate: function(formObj) {
        var formData = formObj.getValues();
    	var validationFields={};
    	   	
    	if (typeof(formData['additional[birthday]']) != 'undefined') {
    		validationFields.birthday=formData['additional[birthday]'];
    	}
     	if (typeof(formData['additional[mobile][]']) != 'undefined') {
    		validationFields.mobile=formData['additional[mobile][]'].join('');
    	}
    	if (typeof(formData['additional[girlsname]']) != 'undefined') {
    		validationFields.girlsname=formData['additional[girlsname]'];
    	}
    	if (typeof(formData['additional[lastname]']) != 'undefined') {
    		validationFields.lastname=formData['additional[lastname]'];
    	}
    	if (typeof(formData['additional[lastschool]']) != 'undefined') {
    		validationFields.lastschool=formData['additional[lastschool]'];
    	}
    	if (typeof(formData['additional[zip]']) != 'undefined') {
    		validationFields.zip=formData['additional[zip]'];
    	}
    	if (typeof(formData['additional[phone][]']) != 'undefined') {
    		validationFields.phone=formData['additional[phone][]'].join('');
    	}
    	if (typeof(formData['additional[firstname]']) != 'undefined') {
    		validationFields.firstname=formData['additional[firstname]'];
    	}
    	if (typeof(formData['additional[url]']) != 'undefined') {
    		validationFields.url=formData['additional[url]'];
    	}
    	if (typeof(formData['additional[city]']) != 'undefined') {
    		validationFields.city=formData['additional[city]'];
    	}
    	
        var validation = Ext.create('AdditionalFieldsValidation', validationFields);

        var errs = validation.validate();
        var msg = '';

        if (!errs.isValid()) {
            errs.each(function(err) {
                msg += err.getMessage() + '<br />';
            });

            Ext.Msg.alert('Ungültige Eingaben', msg);
            return false;
        } else {
            return true;
        }
    }
});
    	
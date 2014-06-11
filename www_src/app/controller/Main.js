/**
 * Controller for the "Main" panels (Contactlist and Chatlist)
 */
Ext.define('Huhu.controller.Main', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			main: 'chatscontainer',
			chatslist: 'chatslist',
			tabPanel: 'mainpanel',
			contactlist: 'contactlist',
			chatmessage: 'chatmessage',
			chatinvitecontainer: 'chatinvite',
			chatinvitelist: 'chatinvitelist',
			contactscontainer: 'contactscontainer',
			filetransferuploadbutton: 'component[itemId=filetransferuploadbutton]'
		},
		control: {
			chatslist: {
				disclose: 'openChat',
				refresh: 'updateUnreadCount'
			},
			contactlist: {
				disclose: 'openChat',
				refresh: 'updateOpenRequestsCount'
			},
			chatmessage: {
				updatedata: 'parseSmilies'
			},
			'component[itemId=groupchatstart]': {
				tap: 'startgroupchat'
			},
			filetransferuploadbutton: {
				tap: 'fileTransferUploadClassic'
			}
		}
	},
	
	
	/** 
	 * starts a groupchat (or invite more people to existing chat)
	 */
	startgroupchat: function() {
		var chatinvitecontainer=this.getChatinvitecontainer();
		var chatinvitelist=this.getChatinvitelist();
		
		var records=chatinvitelist.getSelection();
		
		var userids=[];
		for (var x in records) {
			userids.push(records[x].data.userid);
		}
		
		
		var data=chatinvitecontainer.getData();
		if (typeof(data)=='object' && typeof(data.chatid) != 'undefined') {
			// we have a chat id, and just invite more users to it
			Ext.Ajax.request({
				url: Huhu.util.Config.getApiUrl() + 'chat/add-user',
				params: { chatid: data.chatid, 'userids[]': userids },
				scope: this,
				success: function(response, opts) {
					var reader=Ext.create('Ext.data.reader.Json');
		        	var data=reader.getResponseData(response);
		        	if (data.success) {
		        		// add users was successfull, close this list, bring the chat with the id to front
		        		
		        		// close chat invite list
		        		var contactscontainer=this.getContactscontainer();
	        			var itemsToRemove=contactscontainer.getItems().length - 2;
	        			contactscontainer.pop(itemsToRemove);
        				
	        			contactscontainer.setActiveItem(0);
	        			
	        			window.chatPanelToDestroyAfterClose=this.getChatinvitecontainer();
        				window.setTimeout(function() {
        					window.chatPanelToDestroyAfterClose.destroy();
        				}, 500);
        				
        				// bring the right chat to front
        				if (data.chatid) {
        					this.openChat(null, { data: { chatid: data.chatid }});
        				} 
		        	}
				}
			});
		} else {
			// open new groupchat 
			Ext.Ajax.request({
				scope: this,
				url: Huhu.util.Config.getApiUrl() + 'chat/open',
				params: { 'userids[]': userids },
				success: function(response, opts) {
					var reader=Ext.create('Ext.data.reader.Json');
		        	var data=reader.getResponseData(response);
		        	if (data.success && data.chatid) {
		        		
		        		
		        		if (data.reopen) {
		        			// chat was reopened.. check if we have this panel..
		        			var panel=Huhu.app.openchatpanels.get('chat' + data.chatid);
		        			if (panel!=undefined) {
		        				// we have a chat window... just bring it to the front
		        				this.getMain().push(panel);
		        				return;
		        			}
		        		}
		        		
		        		// refresh open chats list
		        		var chatslist=Ext.ComponentQuery.query('chatslist');
		        		chatslist[0].getStore().load();
		        		chatslist[0].refresh();
		        		
		        		this.createChatWindow(data);
		        		
		        		this.sendActiveChatWindow(data.chatid);
		        	}
				}
			});
		}
	},

	
	
	/**
	 * Converts emoticons into smilies
	 */
	parseSmilies: function(el, newData, opts) {
		if (typeof(newData.smiliesParsed) != 'undefined' && newData.smiliesParsed) {
			return;
		}
			
		// parse smilies
		if (typeof(newData.message) == 'string') {
			// file upload status!
			var isFileUpload=newData.message.match(/##UPLOAD:([A-Za-z0-9_]*)##/);
			if (isFileUpload) {
				
				window.uploadProgressUpdate=function(isFileUpload) {
					Ext.Ajax.request({
						url: Huhu.util.Config.getApiUrl() + 'chat/file-transfer-get-status-html',
						params: { uploadid: isFileUpload[1], PHP_SESSION_UPLOAD_PROGRESS: '345' },
						method: 'POST',
						success: function(response, opts) {
							var reader=Ext.create('Ext.data.reader.Json');
				        	var data=reader.getResponseData(response);
				        	if (data.success) {
				        		if (data.progress == 100 || data.progress == -2) {
				        			// ready or error - just place html (eventually kill intervall)
				        			Ext.DomQuery.select('#uploadContainer' + data.uploadid)[0].innerHTML=data.html;
				        			
				        			if (typeof(window.uploadProgressIntervals)=='object' && typeof(window.uploadProgressIntervals[isFileUpload[1]]) != 'undefined' && window.uploadProgressIntervals[isFileUpload[1]]) {
				        				window.clearTimeout(window.uploadProgressIntervals[isFileUpload[1]]);
				        				window.uploadProgressIntervals[isFileUpload[1]]=null;
				        			}
				        		} else {
				        			// place html and set intervall to update until finished
				        			var container=Ext.DomQuery.select('#uploadContainer' + data.uploadid)[0];
				        			if (typeof(container.innerHTML) == 'undefined') {
				        				// container does not exist (any longer) don't set new timeout 
				        				
				        			} else {
				        				container.innerHTML=data.html;
				        			
					        			if (typeof(window.uploadProgressIntervals)!='object') {
					        				window.uploadProgressIntervals={};
					        			}
					        			if (typeof(window.uploadProgressIntervals[isFileUpload[1]]) != 'undefined' && window.uploadProgressIntervals[isFileUpload[1]]) {
					        				window.clearTimeout(window.uploadProgressIntervals[isFileUpload[1]]);
					        			}
					        			window.uploadProgressIntervals[isFileUpload[1]]=window.setTimeout(function() {
					        				window.uploadProgressUpdate(isFileUpload);
					        			}, 1000);
				        			}
				        		}
				        	}
						}
					});
				};
				
				window.uploadProgressUpdate(isFileUpload);
				
				newData.message=newData.message.replace(/##UPLOAD:([A-Za-z0-9_]*)##/g, '<div id="uploadContainer' + isFileUpload[1] + '"><div class="loadericon">&nbsp;</div></div>');
			}
			
			newData.message=newData.message.replace(/:(\-)?\)/g, '<div class="smilie smile">&nbsp;</div>');
			newData.message=newData.message.replace(/:(\-)?\(/g, '<div class="smilie sad">&nbsp;</div>');
			newData.message=newData.message.replace(/:(\-)?p/gi, '<div class="smilie thung">&nbsp;</div>');
			newData.message=newData.message.replace(/:'(\-)?\(/g, '<div class="smilie cry">&nbsp;</div>');
			newData.message=newData.message.replace(/:(\-)?o/gi, '<div class="smilie wow">&nbsp;</div>');
			newData.message=newData.message.replace(/:(\-)?d/gi, '<div class="smilie grin">&nbsp;</div>');
			newData.message=newData.message.replace(/;(\-)?\)/g, '<div class="smilie twinker">&nbsp;</div>');
		}
		
		
		newData.smiliesParsed=true; // avoid infinite loop!
		el.setData(newData);
	},
	
	
	/* sets text of tab badge */
	setBadgeText: function(componentIndex, text) {
		var tabBar=this.getTabPanel().getTabBar();
		if (typeof(tabBar) != 'undefined') {
			var component=tabBar.getComponent(componentIndex);
			if (typeof(component) != 'undefined' && typeof(component.setBadgeText) != 'undefined') {
				component.setBadgeText(text);
			}
		}

		// wait for painted event
		this.getTabPanel().getTabBar().on('painted', function(that, eopts) {
			this.getComponent(componentIndex).setBadgeText(text);
		});
	},
	
	
	
	/* updates the open requests count (badge text) in the tab bar and set group css class */
	updateOpenRequestsCount: function(that, eops) {
		// update open requests count
		var c=0;
		var data=that.getStore().getData().each(function(item, index, l) {
			if (item.get('isrequest') == 1) {
				c++;
			}
		});
		
		if (c > 0) {
			this.setBadgeText(0, c);
		} else {
			this.setBadgeText(0, 0);
		}
		
		
		window.openRequestsCount=c;
		window.setTimeout(function() {
			var els=Ext.DomQuery.select('.x-list.contactlist .x-list-disclosure');
			for (var x in els) {
				var el=Ext.DomQuery.select('#' + els[x].id);
				if (x < window.openRequestsCount) {
					Ext.dom.Element.get(els[x]).addCls('openRequestDisclosure');
				} else {
					Ext.dom.Element.get(els[x]).removeCls('openRequestDisclosure');
				}
			}				
		}, 500);
		
		
		
	},
	
	/* updates the unread message count (badge text) in the tab bar */
	updateUnreadCount: function(that, eops) {
		var c=0;
		var data=that.getStore().getData().each(function(item, index, l) {
			var data=item.get('unreadMessagesCount');
			c+=data;
		});
			
		if (c > 0) {
			this.setBadgeText(1, c);
		} else {
			this.setBadgeText(1, 0);
		}
	},
	
	/* opens a new chat, or brings existing chat window to front */
	openChat: function(list, record) {
		var that=this;
		
		if (typeof(record.data.isrequest) != 'undefined' && record.data.isrequest) {
			Ext.Msg.show({
				title: 'Kontaktanfrage akzeptieren', 
				message: 'Kontaktanfrage von ' + record.data.name + ' akzeptieren und ' + record.data.name + ' zu deiner Kontaktliste hinzufügen?',
				buttons: [
					{ text: 'Ja, akzeptieren', itemId: 'yes' },
					{ text: 'Nein, ablehnen', itemId: 'reject' },
					{ text: 'Später', itemId: 'no' }
				],
				fn: function(buttonId, value, opt) {
					if (buttonId=='yes') {
						Ext.Ajax.request({
							url: Huhu.util.Config.getApiUrl() + 'contacts/accept',
							params: { id: record.data.contactlist_id },
							success: function(response, opts) {
								var reader=Ext.create('Ext.data.reader.Json');
					        	var data=reader.getResponseData(response);
					        	if (data.success) {
					        		Ext.Msg.alert('Akzeptiert', data.message);
					        		
					        		// refresh contact list
					        		var contactlist=that.getContactlist();
				           			contactlist.getStore().load();
				           			contactlist.refresh();
					        	}
							}
						});
					} else if (buttonId=='reject') {
						
						Ext.Msg.show({
							title: 'Wirklich ablehnen?', 
							message: 'Die Kontaktabfrage von ' + record.data.name + ' wirklich ablehnen?',
							buttons: [
								{ text: 'Ja, ablehnen', itemId: 'yes' },
								{ text: 'Nein, zurück', itemId: 'no' }
							],
							fn: function(buttonId, val, opt) {
								if (buttonId=='yes') {
									Ext.Ajax.request({
										url: Huhu.util.Config.getApiUrl() + 'contacts/reject',
										params: { id: record.data.contactlist_id },
										success: function(response, opts) {
											var reader=Ext.create('Ext.data.reader.Json');
								        	var data=reader.getResponseData(response);
								        	if (data.success) {
								        		Ext.Msg.alert('Abgelehnt', data.message);
								        		
								        		// refresh contact list
								        		var contactlist=that.getContactlist();
							           			contactlist.getStore().load();
							           			contactlist.refresh();
								        	}
										}
									});
								}
							}
						});
						
					}
				}
			});
			
			
			return;
		}
		
		this.getTabPanel().setActiveItem(1);
		
			
		// first check if we have a chatid...
		if (typeof(record.data.chatid)!='undefined' && record.data.chatid) {
			// we have a chat id, check if we have also an existing chat window
			var panel=Huhu.app.openchatpanels.get('chat' + record.data.chatid);
			if (panel!=undefined) {
				// we have a chat window... just bring it to the front
				this.getMain().push(panel);
				this.sendActiveChatWindow(record.data.chatid);
			} else {
				// we do NOT have an existing window.. we need to request chat data from backend
				Ext.Ajax.request({
					scope: this,
					url: Huhu.util.Config.getApiUrl() + 'chat/reopen',
					params: { chatid: record.data.chatid },
					success: function(response, opts) {
						var reader=Ext.create('Ext.data.reader.Json');
			        	var data=reader.getResponseData(response);
			        	if (data.success && data.chatid) {
			        		this.createChatWindow(data);
			        		this.sendActiveChatWindow(record.data.chatid);
			        	}
					}
				});
			}
		} else {
			// open a new chat
			Ext.Ajax.request({
				scope: this,
				url: Huhu.util.Config.getApiUrl() + 'chat/open',
				params: { userids: record.data.userid },
				success: function(response, opts) {
					var reader=Ext.create('Ext.data.reader.Json');
		        	var data=reader.getResponseData(response);
		        	if (data.success && data.chatid) {
		        		if (data.reopen) {
		        			// chat was reopened.. check if we have this panel..
		        			var panel=Huhu.app.openchatpanels.get('chat' + data.chatid);
		        			if (panel!=undefined) {
		        				// we have a chat window... just bring it to the front
		        				this.getMain().push(panel);
		        				return;
		        			}
		        		}
		        		
		        		// refresh open chats list
		        		var chatslist=Ext.ComponentQuery.query('chatslist');
		        		chatslist[0].getStore().load();
		        		chatslist[0].refresh();
		        		
		        		this.createChatWindow(data);
		        		
		        		this.sendActiveChatWindow(data.chatid);
		        	}
				}
			});
		}
	},
	
	/* sends the new active chat window to backend (and decrement the event counter in tabbar) */
	sendActiveChatWindow: function(chatid) {
		var inviteButton=Ext.ComponentQuery.query('component[itemId=inviteButton]');
		if (typeof(inviteButton[0]) != 'undefined' && typeof(inviteButton[0].destroy) != 'undefined') {
			inviteButton[0].destroy();
		}
		var closeButton=Ext.ComponentQuery.query('component[itemId=closeButton]');
		if (typeof(closeButton[0]) != 'undefined' && typeof(closeButton[0].destroy) != 'undefined') {
			closeButton[0].destroy();
		}
		var fileTransferButton=Ext.ComponentQuery.query('component[itemId=fileTransferButton]');
		if (typeof(fileTransferButton[0]) != 'undefined' && typeof(fileTransferButton[0].destroy) != 'undefined') {
			fileTransferButton[0].destroy();
		}
		
		
		if (chatid) {
			// add or update toolbar buttons to navigation view
			
			Huhu.util.Config.setActiveChatId(chatid);
			
			Ext.Ajax.request({
				url: Huhu.util.Config.getApiUrl() + 'chat/get-title',
				params: { chatid: chatid },
				scope: this,
				success: function(response, opts) {
					var reader=Ext.create('Ext.data.reader.Json');
		        	var data=reader.getResponseData(response);

					if (data.success) {
						this.getMain().getNavigationBar().setTitle(data.title);
					}
				}
			});
			
			this.getMain().getNavigationBar().add({
				xtype: 'button',
				itemId: 'fileTransferButton',
				align: 'right',
				iconCls: 'box',
				scope: { chatid: chatid },
				handler: this.transferFile
			});
			
			this.getMain().getNavigationBar().add({
				xtype: 'button',
				itemId: 'inviteButton',
				align: 'right',
				iconCls: 'team',
				scope: this,
				handler: function() {
					// switch to contact tab
					window.switchToTabItemAfterChatInviteClose=this.getTabPanel().getActiveItem();
					this.getTabPanel().setActiveItem(0);
					
					this.getContactscontainer().push({
			       		xtype: 'chatinvite',
			       		data: {chatid: chatid },
			       		title: 'Zum Gruppenchat einladen'
			       	});
				}
			});
			this.getMain().getNavigationBar().add({
				xtype: 'button',
				itemId: 'closeButton',
				align: 'right',
				iconCls: 'poweroff',
				scope: { chatid: chatid },
				handler: this.closeChat
			});
			
			
		} 
		
		
		// get unread message for this chat
		var chatList=this.getChatslist();
		var items=chatList.getInnerItems()[0].getItems();
		
		items.each(function(item, index, opts) {
			var record=item.getRecord();

			if (record.data.chatid==chatid) {
				// decrement unread count from tabicon
		    	var tabPanel=this.getTabPanel();
		    	var c=parseInt(tabPanel.getTabBar().getComponent(1).getBadgeText());
		    	c-=record.data.unreadMessagesCount;
		    	if (c<=0) {
		    		c=0;
		    	}
		    	tabPanel.getTabBar().getComponent(1).setBadgeText(c);
		    	
		    	
				// reset unread count
				record.data.unreadMessagesCount=0;
				item.setRecord(record);
				
				// reset badge in list element
				// do it dirty...
				var id=item.getId();
				var elbadge=Ext.DomQuery.select('#' + id + ' .chatlistunreadmsg .badge');
				elbadge[0].style.display='none';
				elbadge[0].innerHTML=0;
			}
		}, this);

		
	
		Ext.Ajax.request({
			url: Huhu.util.Config.getApiUrl() + 'chat/set-active-chat',
			params: { id: chatid }
		});
	},
	
	
	/**
	 * Let user choose a file and transfer it to everyone in the chat
	 */
	transferFile: function(fileTransferButton) {
		// +++
		
		if (typeof(window.FileTransfer) != 'undefined') {
			// we are the app..
		} else {
			// we are only the webpage
			overlay = Ext.Viewport.add({
	            xtype: 'panel',
	            
	            itemId: 'fileTransferUploadDialogOverlay',

	            // We give it a left and top property to make it floating by default
	            left: 0,
	            top: 0,

	            // Make it modal so you can click the mask to hide the overlay
	            modal: true,
	            hideOnMaskTap: true,

	            // Make it hidden by default
	            hidden: true,

	            // Set the width and height of the panel
	            width: '80%',
	            height: '70%',

	            // Here we specify the #id of the element we created in `index.html`
	            contentEl: 'content',

	            // Style the content and make it scrollable
	            styleHtmlContent: true,
	            scrollable: true,

	            // Insert a title docked at the top with a title
	            items: [
	                {
	                    docked: 'top',
	                    xtype: 'toolbar',
	                    title: 'Datei senden'
	                },
	                {
	                	xtype: 'container',
	                	items: [
				                {
				                	html: '<h3>Du kannst nun eine Datei von deinem Computer auswählen und an alle in diesem Chat senden.</h3>'
				                },
				                {
				                	xtype: 'formpanel',
				                	style: 'height: 200px',
				                	itemId: 'filetransferuploadform',
				                	id: 'filetransferuploadform',
				                	listeners: {
				                		painted: function(form, opts) {
				                			form.set({ enctype: 'multipart/form-data' });
				                		}
				                	},
				                	items: [
				                	        { 
				                	        	xtype: 'fieldset',
				                	        	title: 'Datei hochladen',
				                	        	items: [
							                	        {
							                	        	html: '<label for="filetransfer_file">Datei aussuchen: </label>'
							                	        		+ '<input type="file" name="file" id="filetransfer_file" accept=".jpg,.png,.gif,.mp4,.mkv,.avi,.mp3,.mpg,.pdf,.docx,.xlsx,.pptx,.odt,.ods,.odi,.doc,.xls,.ppt" />'

							                	        		
							                	        	
							                	        },
							                	        {
							                	        	html: '<br /><span>Als Dateitypen sind lediglich Bilder (.jpg, .png, .gif), Videos (.mp4, .mkv, .avi, .mpg), Musik(.mp3) sowie Dokumente (.pdf, .docx, .xlsx, .pptx, .odt, .ods, .odi, .doc, .xls, .ppt) erlaubt.</span><br /><br />',
							                	        },
							                	        { 
							                	        	 xtype: 'button',
							                                 text: 'Upload',
							                                 ui: 'confirm',
							                                 iconCls: 'arrow_up',
							                                 itemId: 'filetransferuploadbutton'
							                	        }
			                	        	        ]
				                	        }
				                	]
				                }
	                	]
	                }
	            ]
	        });
			
			
			overlay.showBy(fileTransferButton);
		}
		
	},
	
	/**
	 * does the "classic" upload of files to transfer (not for the app)
	 */
	fileTransferUploadClassic: function() {
		
		/*
		 * +++
		 * - before start uploading, send infos to API
		 * - check if we have a previewable file, 
		 * - display preview image/video/audio if possible
		 * - display upload status if possible
		 */
		
		// first obtain an unique file id from the api
		Ext.Ajax.request({
			url: Huhu.util.Config.getApiUrl() + 'chat/file-transfer-upload-get-id',
			params: {
				chatid: Huhu.util.Config.getActiveChatId()
			},
			method: 'GET',
			success: function(response, options) {
				var reader=Ext.create('Ext.data.reader.Json');
	        	var data=reader.getResponseData(response);
	        	
	        	if (data.success) {
	        		// we've got the id and start uploading!
	    	        var fileUploadId=data.id;
	    	        
	    	        
	    	        var fileUpload=new FileUpload();
	    			fileUpload.onFileInfoEvent=function(fileInfo) {
	    				// file info received!
	    				Ext.Ajax.request({
	    					url: Huhu.util.Config.getApiUrl() + 'chat/file-transfer-upload-send-fileinfos',
	    					params: {
	    						uploadid: fileUploadId,
	    						filename: fileInfo.name,
	    						filesize: fileInfo.size,
	    						filetype: fileInfo.type
	    					},
	    					method: 'POST',
	    					success: function(response, options) {
	    					}
	    				});
	    			};

	    			fileUpload.onProgressEvent=function(progress) {
	    				var progressPercent=-1;
	    				if (typeof(progress.lengthComputable) != 'undefined' && progress.lengthComputable) {
	    					progressPercent=Math.round((progress.loaded / progress.total) * 100);
	    				}
	    				
//	    				if (progressPercent % 5 == 0) {
//		    				// send progress to the api!
//		    				Ext.Ajax.request({
//		    					url: Huhu.util.Config.getApiUrl() + 'chat/file-transfer-upload-progress',
//		    					params: {
//		    						uploadid: fileUploadId,
//		    						progress: progressPercent
//		    					},
//		    					method: 'POST',
//		    					success: function(response, options) {
//		    					}
//		    				});
//	    				}
	    			};
	    			
	    			fileUpload.onErrorEvent=function(response) {
	    				Ext.Ajax.request({
	    					url: Huhu.util.Config.getApiUrl() + 'chat/file-transfer-abort',
	    					params: {
	    						uploadid: fileUploadId,
	    						message: 'Aborted by client'
	    					}
	    				});
	    				alert('Fehler beim senden der Datei: ' + response.message);
	    			};
	    			
	    			fileUpload.upload('filetransfer_file', Huhu.util.Config.getApiUrl() + 'chat/file-transfer-upload-classic', fileUploadId);
	    			Ext.ComponentQuery.query('component[itemId=fileTransferUploadDialogOverlay]')[0].destroy();
	        	}
			}
		});
	},
	
	/**
	 * Closes chat window, destroys chat (even from db)
	 */
	closeChat: function() {
		var chatid=Huhu.util.Config.getActiveChatId();
		Ext.Msg.show({
			title: 'Chat schließen', 
			message: 'Soll dieser Chat wirklich geschlossen werden? Der Nachrichtenverlauf wird dann gelöscht.',
			buttons: [
				{ text: 'Ja, schlie&szlig;en', itemId: 'yes' },
				{ text: 'Nein, Zurück', itemId: 'no' }
			],
			fn: function(buttonId, value, opt) {
				if (buttonId=='yes') {
					Ext.Ajax.request({
						url: Huhu.util.Config.getApiUrl() + 'chat/close',
						params: { chatid: chatid },
						success: function(response, opts) {
							var reader=Ext.create('Ext.data.reader.Json');
				        	var data=reader.getResponseData(response);
				        	if (data.success) {
				        		// close and destroy this window
				        		var panel=Huhu.app.openchatpanels.get('chat' + data.chatid);
				        		if (panel) {
				        			var chatcontainer=Ext.ComponentQuery.query('chatscontainer');
				        			chatcontainer=chatcontainer[0];
				        			var itemsToRemove=chatcontainer.getItems().length - 2;
			        				chatcontainer.pop(itemsToRemove);
			        				
			        				chatcontainer.setActiveItem(0);
			        				
			        				window.chatPanelToDestroyAfterClose='chat' + data.chatid;
			        				window.setTimeout(function() {
			        					var panel=Huhu.app.openchatpanels.get(window.chatPanelToDestroyAfterClose);
			        					panel.destroy();
			        					Huhu.app.openchatpanels.removeAtKey(window.chatPanelToDestroyAfterClose);
			        				}, 500);
				        		}
				        	}
						}
					});
				}
			}
		});
	},
	
	
	/* Creates a new chat window and brings it to the front */
	createChatWindow: function(data) {
		// ensure the right tab is active
		this.getTabPanel().setActiveItem(1);

		// create the panel
		panel=Ext.create('Huhu.view.Chat', {
			title: data.title,
   			data: data
		});
		
		// set scroll-to-end listener
		panel.query('chatcontainer')[0].onAfter('add', function(container, item, index, eOpts) {
			if (typeof(window.scrollContainer) != 'array') window.scrollContainer=[];
			window.scrollContainer.push(container);
			window.setTimeout(function() {
				var panel=window.scrollContainer.pop();
				if (panel) {
					panel.getScrollable().getScroller().scrollToEnd(true);
				}
			}, 200);
		});
		
		panel.onAfter('activate', function(panel, newActiveItem, oldActiveItem, eOpts) {
			// scroll to end after activate
			newActiveItem.query('chatcontainer')[0].getScrollable().getScroller().scrollToEnd();
		});
		
		panel.on('deactivate', function(panel, newActiveItem, oldActiveItem, eOpts) {
			this.sendActiveChatWindow(0);
		}, this);
		
		
		// if we have recent messages, append them!
		if (typeof(data.messages)=='object' || typeof(data.messages)=='array') {
			var container=panel.query('chatcontainer');
					
			for (var x in data.messages) {
				container[0].add({
					xtype: 'chatmessage',
					data: {
						message: Huhu.util.Chat.messageDecode(data.messages[x].message),
						datetime: data.messages[x].datetime,
						from: data.messages[x].user_name,
						myself: data.messages[x].myself
					}
				});
			}
		}
		
		
		// set value of hidden inputfield to chatid
		var chatid=panel.query('component[itemId=chatid]');
		chatid[0].setValue(data.chatid);
		Huhu.app.openchatpanels.add('chat' + data.chatid, panel);
		
		// push to front
		this.getMain().push(panel);   
	}
	
	
});


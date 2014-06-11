Ext.define('Huhu.push.Common', {
    processData: function(data) {
        try {
            var reader=Ext.create('Ext.data.reader.Json');
            var message=reader.getResponseData(data);

            switch (message.action) {
                case 'revalidate':
                    this.revalidate();
                    break;

                case 'chatclosed':
                    if (typeof(message.chatId) == 'undefined') {
                        this.debug(['Incomplete data', message]);
                    } else {
                        this.processChatClosed(message);
                    }
                    break;

                case 'contactrequest':
                    this.processContactRequest(message);
                    break;

                case 'contactlist':
                    this.processContactList(message);
                    break;

                case 'message':
                    if (typeof(message.message_id) == 'undefined' || typeof(message.chatId) == 'undefined' || typeof(message.dateTime) == 'undefined' || typeof(message.fromuser) == 'undefined' ||typeof(message.mySelf) == 'undefined') {
                        this.debug(['Incomplete data', Ext.encode(message)]);
                    } else {
                        this.processMessage(message);
                    }
                    break;

                case 'openchats':
                    this.processOpenChats(message);
                    break;

                case 'updatepublickey':
                    this.processUpdatePublicKey(message);
                    break;

                case 'userlist':
                    this.processUserlist(message);
                    break;

                default:
                    this.debug('Unknown action: ' + message.action);
                    break;
            }
        } catch (e) {
            this.debug(['EXCEPTION WHILE PARSING JSON', e]);
        }
    },


    /**
     * Is called if a chat was closed. Finds the panel, and destroys it
     * @param message
     */
    processChatClosed: function(message) {
        // a chat was closed, find the panel and remove and destroy it
        var panel=Huhu.app.openchatpanels.get('chat' + message.chatId);
        if (panel!=undefined) {
            var chatsContainer=Ext.ComponentQuery.query('chatscontainer');
            chatsContainer=chatsContainer[0];
            // check if this chat is the active in the chatscontainer, if so pop it
            if (chatsContainer.getActiveItem() == panel) {
                chatsContainer.pop();
            }

            if (typeof(panel.destroy) != 'undefined') {
                window.chatPanelToDestroyAfterRemoteClose=panel;
                window.setTimeout(function() {
                    chatPanelToDestroyAfterRemoteClose.destroy();
                });
            }
            // remove it from the open chats listz
            Huhu.app.openchatpanels.removeAtKey('chat' + message.chatId);
        }
    },


    /**
     * Is called if a contact request comes in. refreshes the contactlist, updated badges in toolbar
     * @param message
     */
    processContactRequest: function(message) {
        var contactlist=Ext.ComponentQuery.query('contactlist');
        contactlist=contactlist[0];
        contactlist.getStore().load();
        contactlist.refresh();
    },


    /**
     * Is called if the contactlist changes. Reloads the contactlist
     * @param message
     */
    processContactList: function(message) {
        // contactlist changed - reload contactlist AND chatlist (cause of status)
        var contactlist=Ext.ComponentQuery.query('contactlist');
        contactlist=contactlist[0];
        contactlist.getStore().load();
        contactlist.refresh();

    },


    /**
     * Is called if a message comes in. Updates badges in toolbar, if chat window open, appends the message
     * @param message
     */
    processMessage: function(message) {

        if (Huhu.util.Config.getDebug()) {
            console.debug('processing message');
        }


        // check if we have an open chatpanel to append
        var panel=Huhu.app.openchatpanels.get('chat' + message.chatId);

        if (panel==undefined) {
            Huhu.app.indicateNewMessage();
        } else {

            if (Huhu.util.Config.getDebug()) {
                console.debug('update open chat panel');
            }

            if (typeof(message.fullmessage)=='undefined') {
                if (Huhu.util.Config.getDebug()) {
                    console.debug('requesting messages from server, chatId: ' + message.chatId + ' messageId: ' + message.message_id);
                }


                // load new messages from the server
                Ext.Ajax.request({
                    url: Huhu.util.Config.getApiUrl() + 'chat/get-new-messages',
                    params: { chatid: message.chatId, message_id: message.message_id },
                    scope: this,
                    success: function(response, opts) {
                        var reader=Ext.create('Ext.data.reader.Json');
                        var data=reader.getResponseData(response);

                        if (Huhu.util.Config.getDebug()) {
                            console.debug('response: ' + response.responseText);
                        }

                        if (data.success) {


                            if (Huhu.util.Config.getDebug()) {
                                console.debug('successful get-new-messages response');

                                var tmp=[ data ];
                                do {
                                    var tmp1=tmp.pop();
                                    for (var x in tmp1) {
                                        if (typeof(tmp1[x]) == 'object' || typeof(tmp1[x]) == 'array') {
                                            tmp.push(tmp1[x]);
                                        } else {
                                            console.log(x + ': ' + tmp1[x]);
                                        }
                                    }
                                } while (tmp.length);


                            }

                            var container=panel.query('component[itemId=chatcontainer]');




                            for (var x in data.messages) {
                                var decodedMessage=Huhu.util.Chat.messageDecode(data.messages[x].message);
                                this.setLastMessageInChatList(message.chatId, decodedMessage);

                                if (typeof(container[0]) == 'object') {
                                    container[0].add({
                                        xtype: 'chatmessage',
                                        data: {
                                            message: decodedMessage,
                                            datetime: data.messages[x].dateTime,
                                            from: data.messages[x].user_name,
                                            myself: data.messages[x].myself
                                        }
                                    });
                                }
                             }
                        }
                    }
                });
            } else {
                var decodedMessage=Huhu.util.Chat.messageDecode(message.fullmessage);
                this.setLastMessageInChatList(message.chatId, decodedMessage);

                var container=panel.query('component[itemId=chatcontainer]');
                if (typeof(container[0]) == 'object') {
                    container[0].add({
                        xtype: 'chatmessage',
                        data: {
                            message: decodedMessage,
                            datetime: message.dateTime,
                            from: message.fromuser,
                            myself: message.mySelf
                        }
                    });
                }
            }


            // check if currently visible, if not update badge text in tab bar
            var mainChatContainer=Ext.ComponentQuery.query('chatscontainer');
            mainChatContainer=mainChatContainer[0];

            if (mainChatContainer.getActiveItem() != panel) {
                Huhu.app.indicateNewMessage();
            } else {
                // check if tabpanel is hidden
                var tabPanel=Ext.ComponentQuery.query('mainpanel');
                tabPanel=tabPanel[0];

                if (tabPanel.getTabBar().getActiveTab().getTitle() != 'Chats') {
                    Huhu.app.indicateNewMessage();
                }
            }
        }
    },


    setLastMessageInChatList: function(chatId, lastmessage) {
        // set last msg in open chats list
        var chatList=Ext.ComponentQuery.query('chatslist');
        chatList=chatList[0];
        var items=chatList.getInnerItems()[0].getItems();

        items.each(function(item, index, opts) {
            var record=item.getRecord();
            record.data.unreadMessagesCount++;
            item.setRecord(record);

            if (record.data.chatid==chatId) {
                // found the right list entry

                // do it dirty...
                var id=item.getId();
                var elspan=Ext.DomQuery.select('#' + id + ' .chatlistunreadmsg span');
                elspan[0].innerHTML=Huhu.util.Chat.messageDecode(lastmessage);


                // update badge if not visible
                var mainChatContainer=Ext.ComponentQuery.query('chatscontainer');
                mainChatContainer=mainChatContainer[0];

                if (mainChatContainer.getActiveItem() != panel) {
                    var elbadge=Ext.DomQuery.select('#' + id + ' .chatlistunreadmsg .badge');
                    var c=elbadge[0].innerHTML;
                    c=parseInt(c);
                    c++;
                    elbadge[0].innerHTML=c;
                    elbadge[0].style.display="inline";

                }
            }
        });
    },


    /**
     * Is called if open chats lists changes, reloads the list
     * @param message
     */
    processOpenChats: function(message) {
        // open chats changed - reload chatlist
        var chatslist=Ext.ComponentQuery.query('chatslist');
        chatslist=chatslist[0];
        chatslist.getStore().load();
        chatslist.refresh();
    },


    /**
     * Is called when a user in the contactlist updated his public key
     * @param message
     */
    processUpdatePublicKey: function(message) {
        Huhu.util.Chat.setChatRecipients({});
    },

    /**
     * Is called if userlist in a chat changes, updates the list if the chat is open
     * @param message
     */
    processUserlist: function(message) {
        // users in chat changed
        var chatslist=Ext.ComponentQuery.query('chatslist');
        chatslist=chatslist[0];
        chatslist.getStore().load();
        chatslist.refresh();


        // update title for currently active chat
        Ext.Ajax.request({
            url: Huhu.util.Config.getApiUrl() + 'chat/get-title',
            scope: this,
            success: function(response, opts) {
                var reader=Ext.create('Ext.data.reader.Json');
                var data=reader.getResponseData(response);

                if (data.success && data.chatid) {
                    var main=Ext.ComponentQuery.query('chatscontainer');
                    main[0].getNavigationBar().setTitle(data.title);
                }
            }
        });
    },


    debug: function(text) {
        if (Huhu.util.Config.getDebug()) {
            console.debug(['PUSH-DEBUG:', text]);
        }
    }
});
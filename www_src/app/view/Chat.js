Ext.define('Huhu.view.Chat', {
	extend: 'Ext.Container',
	xtype: 'chatpanel',
	requires: [
	           'Huhu.view.ChatContainer',
	           'Huhu.view.ChatMessage'
	       ],
	config: {
		layout: 'vbox',
		items: [
		        {
		        	xtype: 'chatcontainer',
		        	flex: 6
		        },
		        {
		        	 xtype: 'formpanel',
		        	 flex: 1,
		        	 layout: 'hbox',
		        	 margin: '0 0 5px 0',
		        	 items: [
		        	         {
		        	        	xtype: 'hiddenfield',
		        	        	name: 'chatid',
		        	        	itemId: 'chatid',
		        	        	value: '{chatid}'
		        	         },
		        	         {
		                        xtype: 'fieldset',
		                        flex: 2,
		                        margin: 0,
		                        items: [
		                                {
										    xtype: 'textareafield',
										    itemId: 'messagefield',
										    maxRows: 2,
										    name: 'message'
										}
								]
		        	         },
							{
							    xtype: 'button',
							    ui: 'confirm',
				                iconCls: 'reply',
				                flex: 0.5,
				                margin: '0 0 0 10px',
				                handler: function() {
                                    var chatId=this.up('formpanel').query('component[itemId=chatid]')[0].getValue(),
                                        message=this.up('formpanel').query('component[itemId=messagefield]')[0].getValue();

                                    Huhu.util.Chat.sendMessage(chatId, message);

	                                var fields=this.up('formpanel').query('component[itemId=messagefield]');
	                                fields[0].reset();
	                            }
							}
		        	 ]
		        }
		]
		
	}
});

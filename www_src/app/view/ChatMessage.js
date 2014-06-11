Ext.define('Huhu.view.ChatMessage', {
	extend: 'Ext.Panel',
	xtype: 'chatmessage',
	config: 
	{
		tpl: '<div class="chatmessage myself{myself}">'
			+'  <div class="head">'
			+'    <span class="from">{from}</span>'
			+'    <span class="datetime">{datetime}</span>'
			+'  </div>'
			+'  <div class="msg">{message}</div>'
			+'</div>'
			+'<div style="clear: both;"></div>'
	}
});

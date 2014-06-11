Ext.define('Huhu.view.ChatList', {
	extend: 'Ext.List',
	xtype: 'chatslist',
	config: {
		title: 'Offene Chats',
		emptyText: 'Aktuell sind keine Chats offen',
		itemTpl: '{userPhoto}&nbsp;{name}&nbsp;<br /><div class="chatlistunreadmsg"><div class="badge" style="{unreadMessagesHide}">{unreadMessagesCount}</div><span>{lastUnreadMsg}</span></div>',
		store: 'Chats',
		scrollable: 'vertical',
		onItemDisclosure: true
	}
});
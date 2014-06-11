Ext.define('Huhu.model.Chat', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'id', type: 'int' },
            { name: 'chatid', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'users', type: 'auto' },
            { name: 'messages', type: 'auto' },
            { name: 'userPhoto', type: 'string' },
            { name: 'userStatusIcon', type: 'string' },
            { name: 'userStatusText', type: 'string' },
            { name: 'lastUnreadMsg', type: 'string' },
            { name: 'unreadMessagesCount', type: 'int' },
            { name: 'unreadMessagesHide', type: 'string' }
        ]
    }
});


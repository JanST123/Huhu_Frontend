Ext.define('Huhu.model.Contact', {
    extend: 'Ext.data.Model',
    config: {
		sorters: 'sort',

        fields: [
            { name: 'id', type: 'int' },
            { name: 'userid', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'userStatusIcon', type: 'string' },
            { name: 'picture', type: 'string' },
            { name: 'accepted', type: 'boolean' },
            { name: 'type', type: 'string' },
            { name: 'sort', type: 'string' },
            { name: 'isrequest', type: 'int' },
            { name: 'contactlist_id', type: 'int' }
        ]
    }
});


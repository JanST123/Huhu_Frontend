Ext.define('Huhu.model.ContactSearchResult', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'id', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'picture', type: 'string' },
            { name: 'onList', type: 'boolean' },
            { name: 'accepted', type: 'string' },
            { name: 'additionalInfo', type: 'string' },
            { name: 'score', type: 'int' }
        ]
    }
});


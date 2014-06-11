Ext.define('Huhu.model.validation.AdditionalFields', {
    extend: 'Ext.data.Model',
    alias: 'AdditionalFieldsValidation',
    config: {
        fields: [
            {
                name: 'company'
            },
            {
                name: 'birthday'
            },
            {
                name: 'mobile'
            },
            {
                name: 'girlsname'
            },
            {
                name: 'lastname'
            },
            {
                name: 'lastschool'
            },
            {
                name: 'zip'
            },
            {
                name: 'phone'
            },
            {
                name: 'firstname'
            },
            {
                name: 'url'
            },
            {
                name: 'city'
            }
        ],
        validations: [
            {
                type: 'format',
                field: 'mobile',
                matcher: /^[\+0-9]*$/,
                message: 'Telefonnummer darf nur aus Zahlen bestehen..'
            },
            {
                type: 'format',
                field: 'phone',
                matcher: /^[\+0-9]*$/,
                message: 'Telefonnummer darf nur aus Zahlen bestehen..'
            },
            {
                type: 'format',
                field: 'zip',
                matcher: /^[\+0-9]{0,5}$/,
                message: 'Postleitzahl kann nur aus Zahlen bestehen (maximal 5)'
            },
            {
                type: 'format',
                field: 'url',
                matcher: /^[A-Za-z0-9\-\.\?&=#\/:]*$/,
                message: 'Die URL ist ungültig'
            }
        ]
    }
});
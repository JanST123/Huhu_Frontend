Ext.define('Huhu.model.validation.Login', {
    extend: 'Ext.data.Model',
    alias: 'LoginValidation',
    config: {
        fields: [
            {
                name: 'username'
            },
            {
                name: 'password'
            }
        ],
        validations: [
            {
                type: 'presence',
                field: 'username',
                min: 3,
                message: 'Benutzername muss mindestens 3 Zeichen lang sein'
            },
            {
                type: 'presence',
                field: 'password',
                min: 8,
                message: 'Passwort muss mindestens 8 Zeichen lang sein'
            },
            {
                type: 'format',
                field: 'password',
                matcher: /[^a-zA-Z]+/,
                message: 'Passwort muss aus mindestens einem Sonderzeichen oder einer Zahl bestehen'
            }
        ]
    }
});
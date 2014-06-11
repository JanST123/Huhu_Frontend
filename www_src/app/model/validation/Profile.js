Ext.define('Huhu.model.validation.Profile', {
    extend: 'Ext.data.Model',
    alias: 'ProfileValidation',
    config: {
        fields: [
            {
                name: 'email'
            },
            {
                name: 'passwordold',
                allowNull: true
            },
            {
                name: 'password',
                allowNull: true
            },
            {
                name: 'password2',
                allowNull: true
            }
        ],
        validations: [
            {
                type: 'presence',
                field: 'passwordold',
                min: 8,
                message: 'Passwort muss mindestens 8 Zeichen lang sein'
            },
            {
                type: 'presence',
                field: 'password',
                min: 8,
                message: 'Passwort muss mindestens 8 Zeichen lang sein'
            },
            {
                type: 'presence',
                field: 'password2',
                min: 8,
                message: 'Passwort-Wiederholung muss mindestens 8 Zeichen lang sein'
            },
            {
                type: 'format',
                field: 'passwordold',
                matcher: /[^a-zA-Z]+/,
                message: 'Passwort muss aus mindestens einem Sonderzeichen oder einer Zahl bestehen'
            },
            {
                type: 'format',
                field: 'password',
                matcher: /[^a-zA-Z]+/,
                message: 'Passwort muss aus mindestens einem Sonderzeichen oder einer Zahl bestehen'
            },
            {
                type: 'format',
                field: 'password2',
                matcher: /[^a-zA-Z]+/,
                message: 'Passwort-Wiederholung muss aus mindestens einem Sonderzeichen oder einer Zahl bestehen'
            },
            {
                type: 'presence',
                field: 'email',
                message: 'E-Mail Adresse muss angegeben werden, falls du mal dein Passwort vergisst'
            },
            {
                type: 'email',
                field: 'email',
                message: 'E-Mail Adresse ist ungültig'
            }
        ]
    }
});
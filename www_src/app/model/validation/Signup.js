Ext.define('Huhu.model.validation.Signup', {
    extend: 'Ext.data.Model',
    alias: 'SignupValidation',
    config: {
        fields: [
            {
                name: 'username'
            },
            {
                name: 'email'
            },
            {
                name: 'password'
            },
            {
                name: 'password2'
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
            },
            {
                type: 'presence',
                field: 'password2',
                min: 8,
                message: 'Passwort-Wiederholung muss mindestens 8 Zeichen lang sein'
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
const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'danilo2910'
const HASH = '$2b$04$FRQ09Mi9R42XrKjBZCSztefA1ps8c9bU6lQx8XB0stMahohIXfWyG'

describe('UserHelper teste suite', function () {
    it('deve gerar uma hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        assert.ok(result.length > 10)
    })

    it('deve validar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA,HASH)
        assert.ok(result)
    })
})


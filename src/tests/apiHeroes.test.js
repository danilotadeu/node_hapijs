const assert = require('assert')
const api = require('./../api')

let app = {}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}
const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'A mira'
}

let MOCK_ID = ''
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNyaXMiLCJpZCI6MTUsImlhdCI6MTU1MDU5Mzg0NX0.kCEdpWkWznTyM1mIexf3QDBWfJaZzl6Ns6QBda1TlM4'
const headers = {
    Authorization: TOKEN
}

describe('Suite de teste da API Heroes', function (){
    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            method: 'POST',
            headers,
            url: `/herois`,
            payload: MOCK_HEROI_INICIAL
        })

        const result1 = await app.inject({
            method: 'POST',
            headers,
            url: `/herois`,
            payload: MOCK_HEROI_INICIAL
        })

        const result2 = await app.inject({
            method: 'POST',
            headers,
            url: `/herois`,
            payload: MOCK_HEROI_INICIAL
        })

        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id
    })

    it('listar /herois', async () => {
        const result = await app.inject({
            method:'GET',
            headers,
            url:'/herois?skip=0&limit=10'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode,200)
        assert.ok(Array.isArray(dados))
    })

    it('listar /herois - deve retornar somente 3 registros', async () => {
        const TAMANHO_LIMITE = 3
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)

    })

    it('listar /herois - deve retornar um erro com limit incorreto', async () => {
        const TAMANHO_LIMITE = 'AAAe'
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 400)

    })

    it('listar /herois - deve testar busca pelo nome', async () => {


        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=1000&nome=${MOCK_HEROI_INICIAL.nome}`
        })

        const [dados] = JSON.parse(result.payload)

        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.deepEqual(dados.nome, MOCK_HEROI_INICIAL.nome)

    })

    it('cadastrar POST - /herois', async() => {
        const result = await app.inject({
            method: 'POST',
            headers,
            url: `/herois`,
            payload: MOCK_HEROI_CADASTRAR
        })

        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.notDeepStrictEqual(_id, undefined)
        assert.deepEqual(message, "Herói cadastrado com sucesso!")

    })

    it('atualizar PATCH - /herois/:id', async() => {
        const _id = MOCK_ID
        const expected = {
            poder: 'Super Mira'
        }

        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${_id}`,
            payload: expected
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Herói atualizado com sucesso!')
    })

    it('deletar DELETE - /herois/:id', async() => {
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${MOCK_ID}`
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Herói deletado com sucesso!')

    })

})
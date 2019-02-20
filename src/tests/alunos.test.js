const assert = require('assert')
const api = require('./../api')

let app = {}

const MOCK_ALUNO_INICIAL = {
    nome: 'Vitor Rampazzo',
    ra: '12345678'
}

const MOCK_ALUNO_CADASTRAR = {
    nome: 'Danilo Tadeu',
    ra: '12345678'
}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNyaXMiLCJpZCI6MTUsImlhdCI6MTU1MDU5Mzg0NX0.kCEdpWkWznTyM1mIexf3QDBWfJaZzl6Ns6QBda1TlM4'
const headers = {
    Authorization: TOKEN
}

describe('Suite de teste da API Alunos', function (){
    this.beforeAll(async () => {
        app = await api
        let result = {}
        for (let index = 0; index < 2; index++) {
            result = await app.inject({
                method: 'POST',
                headers,
                url: `/alunos`,
                payload: MOCK_ALUNO_INICIAL
            })
        }

        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id
    })

    it('listar /alunos', async () => {
        const result = await app.inject({
            method:'GET',
            headers,
            url:'/alunos?skip=0&limit=10'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode,200)
        assert.ok(Array.isArray(dados))
    })

    it('listar /alunos - deve retornar somente 3 registros', async () => {
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

    it('listar /alunos - deve retornar um erro com limit incorreto', async () => {
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
            url: `/alunos?skip=0&limit=1000&nome=${MOCK_ALUNO_INICIAL.nome}`
        })

        const [dados] = JSON.parse(result.payload)

        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.deepEqual(dados.nome, MOCK_ALUNO_INICIAL.nome)

    })

    it('cadastrar POST - /alunos', async() => {
        const result = await app.inject({
            method: 'POST',
            headers,
            url: `/alunos`,
            payload: MOCK_ALUNO_CADASTRAR
        })

        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.notDeepStrictEqual(_id, undefined)
        assert.deepEqual(message, "Aluno cadastrado com sucesso!")

    })

    it('atualizar PATCH - /alunos/:id', async() => {
        const _id = MOCK_ID
        const expected = {
            nome: 'Taiguara'
        }

        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/alunos/${_id}`,
            payload: expected
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Aluno atualizado com sucesso!')
    })

    it('deletar DELETE - /alunos/:id', async() => {
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/alunos/${MOCK_ID}`
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Aluno deletado com sucesso!')

    })

})
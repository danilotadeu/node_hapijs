const assert = require('assert')
const MongoDb = require('./../db/strategies/mongodb/mongodb')
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
}

const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: 'Super teia'
}

let context = {}

describe('MongoDB Suite de testes', function() {

    this.beforeAll(async () => {
        const connection = MongoDb.connect()
        context = new Context(new MongoDb(connection, HeroiSchema))
        await context.create(MOCK_HEROI_DEFAULT)
    })

    it('verificar conexao', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'

        assert.deepEqual(result,expected)
    })

    it('cadastrar', async () => {
        const {nome, poder} = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    })

    it('listar', async () => {
        const [{nome,poder}] = await context.read({nome: MOCK_HEROI_DEFAULT.nome})
        const result = {
            nome,poder
        }

        assert.deepEqual(result, MOCK_HEROI_DEFAULT)

    })

    it('atualizar', async () => {
        const [itemAtualizar] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })

        const novoItem = {
            ...MOCK_HEROI_DEFAULT,
            nome: 'Mulher Maravilha',
            poder: 'Latir'
        }
        const result = await context.update(itemAtualizar.id,novoItem)
        const [itemAtualizado] = await context.read({ _id: itemAtualizar.id })

        assert.deepEqual(result.nModified, 1)
        assert.deepEqual(itemAtualizado.nome, novoItem.nome)
    })

    it('deletar', async () => {
        const [{ _id }] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome})
        const result  = await context.delete(_id)

        assert.deepEqual(result.n, 1)
    })


})
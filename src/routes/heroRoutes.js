const baseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const failAction = (request, headers, erro) => {
    throw erro;
}
const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroRoutes extends baseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description:'Listar heróis',
                notes:'Pode paginar resultados e filtrar pelo nome',
                validate: {
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    },
                    headers,
                }
            },
            handler: (request, headers) => {

                try {
                    const {skip, limit, nome} = request.query

                    const query = nome ? {
                        nome: {
                            $regex: `.*${nome}*.`
                        }
                    }: {}

                    return this.db.read(nome ? query: {}, skip, limit)

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cadastrar heróis',
                notes: 'Cadastrar herois',
                validate: {
                    failAction,
                    headers,
                    payload: {
                        nome: Joi.string().min(3).max(100).required(),
                        poder: Joi.string().min(3).max(100).required()
                    }
                }
            },
            handler: async (request) =>  {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder })
                    return {
                        message: 'Herói cadastrado com sucesso!',
                        _id:result._id
                    }
                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Atualizar heróis',
                notes: 'Atualizar heróis pelo ID',
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    headers,
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {

                    const {id} = request.params;
                    const payload = request.payload

                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)

                    if (result.nModified !== 1) return Boom.preconditionFailed('Id não encontrado no banco')

                    return {
                        message: 'Herói atualizado com sucesso!'
                    }

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deletar heróis',
                notes: 'Deleta o herói pelo ID',
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {

                    const { id } = request.params;

                    const result = await this.db.delete(id)

                    if (result.n !== 1) return Boom.preconditionFailed('Id não encontrado no banco')

                    return {
                        message: 'Herói deletado com sucesso!'
                    }

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = HeroRoutes
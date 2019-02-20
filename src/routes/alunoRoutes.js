const baseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const failAction = (request, headers, erro) => {
    throw erro;
}
const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class alunoRoutes extends baseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/alunos',
            method: 'GET',
            config: {
                tags: ['api'],
                description:'Listar alunos',
                notes:'Pode paginar resultados e filtrar pelo nome',
                validate: {
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100),
                        ra: Joi.string().min(3).max(100)
                    },
                    headers,
                }
            },
            handler: (request, headers) => {

                try {
                    const {skip, limit, nome, ra} = request.query

                    let query = {}
                    if(nome) {
                        query = {
                            nome: {
                                $regex: `.*${nome}*.`
                            }
                        }
                    }

                    let queryRa = {}

                    if (ra) {
                        queryRa = { ra }
                    }

                    let merged = { ...query, ...queryRa };

                    return this.db.read(nome || ra ? merged: {}, skip, limit)

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    create() {
        return {
            path: '/alunos',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cadastrar alunos',
                notes: 'Cadastrar alunos',
                validate: {
                    failAction,
                    headers,
                    payload: {
                        nome: Joi.string().min(3).max(100).required(),
                        ra: Joi.string().min(3).max(100).required()
                    }
                }
            },
            handler: async (request) =>  {
                try {
                    const { nome, ra } = request.payload
                    const result = await this.db.create({ nome, ra })
                    return {
                        message: 'Aluno cadastrado com sucesso!',
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
            path: '/alunos/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Atualizar aluno',
                notes: 'Atualizar aluno pelo ID',
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    headers,
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        ra: Joi.string().min(3).max(100)
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
                        message: 'Aluno atualizado com sucesso!'
                    }

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }

    delete() {
        return {
            path: '/alunos/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Deletar aluno',
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
                        message: 'Aluno deletado com sucesso!'
                    }

                } catch (error) {
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = alunoRoutes
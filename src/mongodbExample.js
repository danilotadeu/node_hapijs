const Mongoose = require('mongoose')
Mongoose.connect('mongodb://danilo:danilo2910@localhost:27017/herois',
    { useNewUrlParser:true }, function (error) {
        if(!error) return ;
        console.log('Falha na conexão!', error)
    })

const connection = Mongoose.connection

connection.once('open', () => console.log('database rodando'))
const state = connection.readyState

/**
 * 0=> Desconectado
 * 1=> conectado
 * 2=> Conectando
 * 3=> desconectando
 */



 async function main() {

    const resultCadastrar = await model.create({
        nome: 'Batman',
        poder: 'Dinheiro'
    })

    console.log(resultCadastrar)

    const listItens = await model.find()
    console.log(listItens)

 }

 main()
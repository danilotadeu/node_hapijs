const Mongoose = require('mongoose')
const alunosSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    ra: {
        type: Number,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = Mongoose.model('alunos', alunosSchema)

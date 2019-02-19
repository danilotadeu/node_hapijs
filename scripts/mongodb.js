// sudo docker exec - it b43e5bb24802 mongo - u danilo - p danilo2910--authenticationDatabase herois
// show dbs

// use herois

// show collections


for (let i = 0; i <= 10000; i++) {
    db.herois.insert({
        nome: `Flash-${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    })

}

//create
db.herois.insert({
    nome: `Flash`,
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

//read
db.herois.find()

//update
//Perde as outra informações
db.herois.update({ _id: ObjectId("5c656e6d736e033b55edb704")},
                { nome: 'Lanterna verde'})

//sem perder
db.herois.update({ _id: ObjectId("5c656e6d736e033b55edb704") },
    { $set: {nome: 'Mulher Maravilha' }})

//delete
db.herois.remove({})
db.herois.remove({ nome: 'Lanterna verde' })


db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({nome: -1})
db.herois.find({},{nome: 1,_id:0})
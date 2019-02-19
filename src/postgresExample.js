const Sequelize = require('sequelize')
const driver = new Sequelize(
    'heroes',
    'danilo',
    'danilo2910', {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
    }
)

async function main() {
    const Herois = driver.define('herois',
    {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: Sequelize.STRING,
            required: true
        },
        poder: {
            type: Sequelize.STRING,
            required: true
        }
    }, {
        tableName: 'TB_HEROIS',
        freezeTableName: false,
        timestamps: false
    })

    await Herois.sync()
    // await Herois.create({
    //     nome: "Danilo",
    //     poder: "Braço"
    // })
    const result = await Herois.findAll(
        {
            raw: true,
            attributes:['nome']
        }
    )
    console.log(result)
}

main()
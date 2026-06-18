const mongoose = require('mongoose')

// Parametros de Conexion FASE 1
const password = process.env.MONGODB_PASSWORD
const url = process.env.MONGODB_URI

// Establecer conexion y manejar errores FASE 2
mongoose.set('strictQuery', false)
mongoose
    .connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error)
    })

// Definir el esquema y modelo de Mongoose FASE 3
const personSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 3
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{2,3}-\d{6}$/, 'El formato debe ser XX-XXXXXX o XXX-XXXXXX']
    }
})

// Transformar el documento a JSON para eliminar campos innecesarios FASE 4
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

// Exportar el modelo de Mongoose para su uso en otros archivos FASE 5
module.exports = mongoose.model('Person', personSchema)
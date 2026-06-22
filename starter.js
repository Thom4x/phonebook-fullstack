require('dotenv').config() // se carga el archivo .env para acceder a las variables de entorno
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const logger = require('./middlewares/loger')
const Person = require('./models/phone') // se importa el modelo de Mongoose para interactuar con la base de datos MongoDB

const app = express()
const path = require('path')
app.use(express.static(path.join(__dirname, 'dist')))

app.use(cors()) // se habilita el middleware cors para permitir solicitudes desde cualquier origen
app.use(express.json())
app.use(logger)

morgan.token('body', (req) => {
    return JSON.stringify(req.body) // se convierte el cuerpo de la petición a una cadena JSON para que se pueda mostrar en los logs
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) // se configura morgan para que muestre el método, la URL, el estado, el tamaño de la respuesta, el tiempo de respuesta y el cuerpo de la petición en los logs

//app.use(logger)


let phoneBook = []

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then((result) => {
            console.log("Datos obtenidos", result);
            response.json(result)
        })
        .catch((error) => {
            console.log("Error en", error);
        })
})

app.get('/info', (request, response) => {
    const getDate = new Date()
    const formatoDate = getDate.toString();
    response.send(`Phonebook has info for ${phoneBook.length} people<br>${formatoDate}`);
})

app.get('/api/persons/:id', (request, response) => {
    //const id = Number(request.params.id)
    //const person = phoneBook.find(userid => userid.id === id)

    Person.findById(request.params.id)
        .then((resumeId) => {
            response.json(resumeId)
        })

    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).json({ error: "Missing.." })
    // }
})

app.delete('/api/persons/:id', (request, response, next) => {
    //const id = Number(request.params.id)
    //const initialLength = phoneBook.length

    //phoneBook = phoneBook.filter(usr => usr.id !== id)

    //if (phoneBook.length !== initialLength) {
    //    response.status(202).end()
    //} else {
    //    response.status(404).json({ error: "ID Not found.." })
    //}
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(202).end()
        }).catch(error => {
            next(error)
        })

})

//const generateId = () => {
//    const random = Math.floor(Math.random() * 1001);
//    return random
//}


app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.nombre || !body.phone) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const newObject = new Person({
        nombre: body.nombre,
        phone: body.phone
    })

    newObject.save()
        .then((savedPerson) => {
            response.json(savedPerson)
        }).catch((error) => {
            next(error)
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const { nombre, phone } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { nombre, phone },
        { new: true, runValidators: true, context: 'query' })

        .then(idUpdated => {
            response.json(idUpdated)
        })
        .catch(error => next(error))
})

// Conexiones antiguas
//if (phoneBook.find(usr => usr.nombre === newObject.nombre)) {
//    return response.status(400).json({
//        error: 'This person is already added'
//    })
//}

// Metodo anterior para agregar guardar la solicitud POST
//phoneBook = phoneBook.concat(newObject)
//response.json(newObject)



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT)
console.log("Server running in", PORT);


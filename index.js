const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const logger = require('./middlewares/loger')


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


let phoneBook = [
    {
        id: 1,
        nombre: "Arto Hellas",
        phone: "040-123456"
    },
    {
        id: 2,
        nombre: "Ada Lovelace",
        phone: "39-44-5323523"
    },
    {
        id: 3,
        nombre: "Dan Abramov",
        phone: "12-43-234345"
    },
    {
        id: 4,
        nombre: "Mary Poppendieck",
        phone: "39-23-6423122"
    },
    {
        id: 5,
        nombre: "Tom Hanks",
        phone: "123-4567890"
    }
]



app.get('/api/persons', (request, response) => {
    response.json(phoneBook)
})

app.get('/info', (request, response) => {
    const getDate = new Date()
    const formatoDate = getDate.toString();
    response.send(`Phonebook has info for ${phoneBook.length} people<br>${formatoDate}`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phoneBook.find(userid => userid.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).json({ error: "Missing.." })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const initialLength = phoneBook.length

    phoneBook = phoneBook.filter(usr => usr.id !== id)

    if (phoneBook.length !== initialLength) {
        response.status(202).end()
    } else {
        response.status(404).json({ error: "ID Not found.." })
    }
})

const generateId = () => {
    const random = Math.floor(Math.random() * 1001);
    return random
}


app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log("¡He recibido una petición!")
    console.log("Cuerpo de la petición:", body)

    if (!body.nombre || !body.phone) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const newObject = {
        id: generateId(),
        nombre: body.nombre,
        phone: body.phone
    }

    if (phoneBook.find(usr => usr.nombre === newObject.nombre)) {
        return response.status(400).json({
            error: 'This person is already added'
        })
    }
    phoneBook = phoneBook.concat(newObject)
    response.json(newObject)

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT)
console.log("Server running in", PORT);


const Express = require('express')
const bodyParser = require('body-parser')
const Todo = require('./models/todo')
const security = require('./secret/passport.js')

const app = Express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(security.passport.initialize())

const { list, create, update, remove, logging } = require('./actions')


app.post('/signUp', logging.signUp)
app.post('/login', logging.login)
app.get('/todos', list.list)
app.get('/list', passport.passport.authenticate('jwt', { session: false }), list.getLists)
app.get('/todos/:id', list.getToDO)
app.post('/todos', create.createToDO)
app.post('/list', create.createList)
app.put('/todos/:id', update.update)
app.delete('/todos/:id', remove)


app.listen(3000)

Todo.init()

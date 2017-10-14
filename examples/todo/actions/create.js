const Todo = require('../models/todo')
const List = require('../models/list')
const deserializeTodo = require('../util/deserializeTodo')
const deserializeList= require('../util/deserializeList')

module.exports = {createToDO:function create(request, response) {

  const todo = deserializeTodo(request, response)

  if (todo == null) { return }

  Todo.create(todo.description, (error, todo) => {
    if (error) {
      console.error(error)
      response.status(500)
      response.json({error: 'Internal error'})
    } else {
      response.status(201)
      response.json({todo})
    }
  })

},
createList:function createList(request, response) {

  const list = deserializeList(request, response)

  if (list == null) { return }

  List.create(list.name, (error, list) => {
    if (error) {
      console.error(error)
      response.status(500)
      response.json({error: 'Internal error'})
    } else {
      response.status(201)
      list.todos=[{}]
      response.json({list})
    }
  })

}
}

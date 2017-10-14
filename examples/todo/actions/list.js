const Todo = require('../models/todo')
const List = require('../models/list')

module.exports = {
  getToDO:function getToDO(request, response) {

  // Load todos asynchronously (with a callback)
  const id = request.params.id
  console.log(id)
  Todo.loadID(id,(error, todos) => {
    if (error) {
      response.status(500)
      response.json({error: 'Internal error'})
    } else {
      response.json({todos})
      response.end()
    }
  })

},
list:  function list(request, response) {

  // Load todos asynchronously (with a callback)
  const id = request.params.id
  console.log(id,"list")
  Todo.load((error, todos) => {
    if (error) {
      response.status(500)
      response.json({error: 'Internal error'})
    } else {
      response.json({todos})
      response.end()
    }
  })

},
getLists:  function list(request, response) {

  List.load((error, lists) => {
    if (error) {
      response.status(500)
      response.json({error: 'Internal error'})
    } else {
      response.json({lists})
      response.end()
    }
  })

},

}

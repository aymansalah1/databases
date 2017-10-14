module.exports = function deserializeList(request, response) {

  const list = request.body.list

  if (list == null) {
    setError('Specify a list', response)
    return null
  }

  if (list.name != null) {
    list.name = list.name.trim()
  }
  if (list.name == null || list.name.length === 0) {
    setError('Specify a name', response)
    return null
  }
  if (list.todos == null) {
    setError('Specify a ToDo even if Empty ', response)
    return null
  }

  return list

}

function setError(error, response) {
  response.status(400)
  response.json({ error })
  response.end()
}

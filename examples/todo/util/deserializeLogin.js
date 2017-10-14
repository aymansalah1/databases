module.exports = function deserializeTodo(request, response) {

  const info = request.body.info

  if (info == null) {
    setError('Specify a info', response)
    return null
  }


  if (info.userName == null || info.password == null) {
    setError('Specify a UserName and Password ', response)
    return null
  }

  return info

}

function setError(error, response) {
  response.status(400)
  response.json({ error })
  response.end()
}

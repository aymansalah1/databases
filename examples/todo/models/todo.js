const FS = require('fs')
const Path = require('path')
const uuid = require('uuid/v4')


const config = require('./config-secret.json')


var mysql = require('mysql')

var connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})

class Todo {

  //NOTE: future implementation, add user ID here.
  init() {
    //Connect to mysql
    connection.connect()
    // define which database to use
    connection.query('USE TODO', (error, results, fields) => {
      if (error) throw error
    })

    // check for tables and create if it is not there.
    connection.query("SHOW TABLES LIKE 'tasks'", (error, results, fields) => {
      if (error) throw error

      if (results.length === 0) {
        console.log("Creating TABLE 'tasks'")
        connection.query('CREATE TABLE tasks (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, description VARCHAR(50), done BOOL, date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  date_last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);', (error, results, fields) => {
          if (error) throw error
          console.log('Table created: ', results)
        })
      }
      else {
        console.log("TABLE already exist, using: ", results)
      }
    })
  }

  load(callback) {
    let sql = 'SELECT * FROM `task`'
    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      callback(error, results)
    })
  }
  loadID(id, callback) {
    let sql = 'SELECT * FROM `task` WHERE id=?'
    console.log(id)
    sql = mysql.format(sql, parseInt(id.split(":")[1] || id))
    console.log(sql)
    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      callback(error, results)
    })
  }


  create(_description, callback) {
    let sql = 'INSERT INTO `task` (`id`,`description`,`done`,`date_created`,`date_last_modified`) VALUES (NULL, ? , "0", NULL, NULL)'
    let inserts = [_description];
    sql = mysql.format(sql, inserts);

    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      callback(error, results)
    })
  }

  update(id, description, callback) {
    let sql = 'UPDATE `task` SET description = ? WHERE id=?'
    console.log("id ", id);
    let inserts = [description, parseInt(id.split(":")[1])]
    sql = mysql.format(sql, inserts)

    connection.query(sql, (error, results, fields) => {
      if (error) throw error

      const regex = /Rows.matched:.(\d{1,100})/g;
      let m = regex.exec(results.message)

      if (m[1] === '0')
        error = { name: "NotFound" }

      callback(error, results)
    })
  }
  markAsDone(id, callback) {
    let sql = 'UPDATE `task` SET done = ? WHERE id=?'
    this.load((error, todos) => {
      if (error) { callback(error); return }

      const todo = todos.find(t => t.id === id)
      if (todo == null) {
        const error = new Error(`Todo with ID ${id} does not exist`)
        error.name = 'NotFound'

        callback(error)
        return
      }

      todo.done = true

      this.save(todos, error => {
        if (error) { callback(error); return }

        callback(null, todo)
      })
    })
  }

  markAsNotDone(id, callback) {
    this.load((error, todos) => {
      if (error) { callback(error); return }

      const todo = todos.find(t => t.id === id)
      if (todo == null) {
        const error = new Error(`Todo with ID ${id} does not exist`)
        error.name = 'NotFound'

        callback(error)
        return
      }

      todo.done = false

      this.save(todos, error => {
        if (error) { callback(error); return }

        callback(null, todo)
      })
    })
  }

  remove(id, callback) {
    let sql = 'DELETE FROM `task`  WHERE id=?'
    let inserts = [parseInt(id.split(":")[1])]
    sql = mysql.format(sql, inserts)

    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      console.log(results)
      callback(error)
    })
  }

}

module.exports = new Todo()

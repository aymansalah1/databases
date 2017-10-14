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

class list {

  //NOTE: future implementation, add user ID here.
  init() {
    //Connect to mysql
    connection.connect()
    // define which database to use
    connection.query('USE TODO', (error, results, fields) => {
      if (error) throw error
    })

    // check for tables and create if it is not there.
    connection.query("SHOW TABLES LIKE 'Lists'", (error, results, fields) => {
      if (error) throw error

      if (results.length === 0) {
        console.log("Creating TABLE 'Lists'")
        connection.query(`CREATE TABLE IF NOT EXISTS 'todo'.'lists' (
  'id' INT NOT NULL AUTO_INCREMENT,
  'name' VARCHAR(45) NULL,
  PRIMARY KEY ('id'))
ENGINE = InnoDB;`, (error, results, fields) => {
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
    let sql = 'SELECT * FROM `Lists`'
    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      this.attachTODOs(results)
      callback(error, results)
    })
  }
  attachTODOs(lists) {
    console.log("ayman attach ")
    lists.forEach(function (element) {
      let sql = `SELECT * FROM tasks where lists_id =${element.id}`
      console.log(sql),
        connection.query(sql, (error, results, fields) => {
          if (error) throw error
          element.todos = { results }
          console.log(results, element.todos)
        })
    }, this);
  }
  loadID(id, callback) {
    let sql = 'SELECT * FROM `Lists` WHERE id=?'
    console.log(id)
    sql = mysql.format(sql, parseInt(id.split(":")[1] || id))
    console.log(sql)
    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      callback(error, results)
    })
  }


  create(name, callback) {
    let sql = 'INSERT INTO `Lists` (`id`,`name`) VALUES (NULL, ? )'
    let inserts = [name];
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

module.exports = new list()

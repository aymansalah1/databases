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

class login {
  init() {
    //Connect to mysql
    connection.connect()
    // define which database to use
    connection.query('USE TODO', (error, results, fields) => {
      if (error) throw error
    })

    // check for tables and create if it is not there.
    connection.query("SHOW TABLES LIKE 'users'", (error, results, fields) => {
      if (error) throw error

      if (results.length === 0) {
        console.log("Creating TABLE 'users'")
        connection.query(`CREATE TABLE IF NOT EXISTS todo.users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(45) NOT NULL,
  password VARCHAR(45) NULL,
  done TINYINT NOT NULL,
  userscol VARCHAR(45) NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX 'username_UNIQUE' ('username' ASC))
ENGINE = InnoDB;`, (error, results, fields) => {
            if (error) throw error
            console.log('Table User created: ', results)
          })
      }
      else {
        console.log("TABLE User already exist, using: ", results)
      }
    })
  }

  loginCheck(userName, password, callback) {
    let sql = `SELECT username,password,id FROM users where password='${password}' and username='${userName}'`
    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      callback(error, results)
    })
  }
  signUp(userName, password, callback) {
    let sql = 
    `insert into users (username,password,done) values('${userName}','${password}',1)`
    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      let sql = `SELECT username,id FROM users where password='${password}' and username='${userName}'`
      connection.query(sql, (error, results, fields) => {
      callback(error, results)
      })
    })
  }

  getUserFromID(id, callback) {
    let sql = `SELECT username,id FROM users where id = '${id}'`
    connection.query(sql, (error, results, fields) => {
      if (error) throw error
      callback(error, results)
    })

  }
}
module.exports = new login();
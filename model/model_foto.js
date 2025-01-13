const { Store } = require("express-session");
const connection = require("../config/database");

class ModelFoto {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query("select * from foto order by id desc", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async Store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("insert into foto set ?", Data, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query("select * from foto where id = ?", [id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.length > 0 ? rows[0] : null); // Kembalikan null jika tidak ada hasil
        }
      });
    });
  }
  

  static async Update(id, Data) {
    return new Promise((resolve, reject) => {
      connection.query("update foto set ? where id = " + id, Data, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static Delete(id) {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM foto WHERE id = ?", [id], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}

module.exports = ModelFoto;

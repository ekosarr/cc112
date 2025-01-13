const connection = require("../config/database");

class ModelWeb {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM web", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM web WHERE id = ?", id, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = ModelWeb;

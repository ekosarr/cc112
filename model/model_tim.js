const { Store } = require("express-session");
const connection = require("../config/database");

class ModelTim {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query("select * from data_tim order by id desc", (err, rows) => {
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
      connection.query("SELECT * FROM data_tim WHERE id = ?", [id], function (err, result) {
        if (err) {
          reject(err);
        } else {
          // Mengembalikan hasil, jika tidak ada data kembalikan null
          resolve(result.length > 0 ? result[0] : null);
        }
      });
    });
  }

  // Mengambil tim berdasarkan opd_terkait
  static async getAllByOpd(opd_terkait) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM data_tim WHERE opd_terkait = ? ORDER BY id DESC";
      connection.query(query, [opd_terkait], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getGroupTimByOpd(opdTerkait) {
    return new Promise((resolve, reject) => {
      connection.query("SELECT DISTINCT group_tim FROM data_tim WHERE opd_terkait = ? ORDER BY group_tim ASC", [opdTerkait], (err, rows) => {
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
      connection.query("insert into data_tim set ?", Data, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async Update(id, Data) {
    return new Promise((resolve, reject) => {
      connection.query("UPDATE data_tim SET ? WHERE id = ?", [Data, id], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async Delete(id) {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM data_tim WHERE id = ?", [id], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = ModelTim;

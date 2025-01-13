const connection = require("../config/database");

class ModelLokasi {
  static async getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          l.id,
          l.lat_long,
          l.alamat,
          l.desa,
          k.nama_kecamatan AS kecamatan,  -- Mengambil nama kecamatan dari tabel kecamatan
          l.kejadian,
          l.opd,
          l.tanggal_terima,
          l.tanggal_terima_1,
          l.tanggal_selesai,
          l.approve,
          l.ket,
          l.laporan,
          l.tim,
          l.jumlah_tim,
          l.nama_pelapor,
          l.noTelp_pelapor,
          l.bulan,
          l.tahun,
          l.mamin,
          l.klaim_mamin,
          l.qr,
          l.qr_absen
        FROM
          lokasi l
        JOIN
          kecamatan k
        ON
          l.kec = k.id
        ORDER BY
          l.id DESC
      `;

      connection.query(query, (err, rows) => {
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
      const query = `
            SELECT
                l.id,
                l.lat_long,
                l.alamat,
                l.desa,
                k.nama_kecamatan AS kecamatan,  -- Mengambil nama kecamatan dari tabel kecamatan
                l.kejadian,
                l.opd,
                l.tanggal_terima,
                l.tanggal_terima_1,
                l.tanggal_selesai,
                l.approve,
                l.ket,
                l.laporan,
                l.tim,
                l.jumlah_tim,
                l.nama_pelapor,
                l.noTelp_pelapor,
                l.bulan,
                l.tahun,
                l.mamin,
                l.klaim_mamin,
                l.qr,
                l.qr_absen
            FROM
                lokasi l
            JOIN
                kecamatan k
            ON
                l.kec = k.id
            WHERE
                l.id = ?
        `;

      connection.query(query, [id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async Update(id, data) {
    return new Promise((resolve, reject) => {
      // Buat query dengan parameter yang diikat, tambahkan jumlah_tim
      const query = "UPDATE lokasi SET tanggal_selesai = ?, laporan = ?, tim = ?, jumlah_tim = ? WHERE id = ?";
      const values = [data.tanggal_selesai, data.laporan, data.tim, data.jumlah_tim, id]; // Tambahkan data.jumlah_tim

      connection.query(query, values, function (err, result) {
        if (err) {
          reject(err); // Menangani error
        } else {
          resolve(result); // Mengembalikan hasil
        }
      });
    });
  }

  static async Klaim(id, data) {
    return new Promise((resolve, reject) => {
      // Buat query dengan parameter yang diikat, tambahkan jumlah_tim
      const query = "UPDATE lokasi SET  klaim_mamin = ? WHERE id = ?";
      const values = [data.klaim_mamin, id]; // Tambahkan data.jumlah_tim

      connection.query(query, values, function (err, result) {
        if (err) {
          reject(err); // Menangani error
        } else {
          resolve(result); // Mengembalikan hasil
        }
      });
    });
  }
}

module.exports = ModelLokasi;

var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelTim = require("../model/model_tim.js");
const path = require("path");
const multer = require("multer");
const fs = require("fs"); // Import fs untuk menghapus file

// Konfigurasi penyimpanan untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/ttd"); // Menyimpan di dalam subfolder 'ttd'
  },
  filename: (req, file, cb) => {
    // Ambil nama_tim dari req.body
    const namaTim = req.body.nama_tim;

    // Ganti nama file yang di-upload menjadi ttd/nama_tim.ext
    const fileName = `${namaTim}${path.extname(file.originalname)}`; // Menggunakan nama_tim dari req.body
    cb(null, fileName); // Simpan file dengan nama: nama_tim.ext
  },
});
const upload = multer({ storage: storage });

// Mendapatkan semua lokasi
router.get("/getall", async (req, res) => {
  try {
    const opdTerkait = req.query.opd_terkait; // Mengambil query parameter

    let rows;
    if (opdTerkait) {
      // Jika opd_terkait diberikan, ambil data sesuai filter
      rows = await ModelTim.getAllByOpd(opdTerkait);
    } else {
      // Jika tidak ada filter, ambil semua
      rows = await ModelTim.getAll();
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data tim" });
  }
});

// Route untuk mengambil data berdasarkan ID
router.get("/getbyid/:id", async (req, res) => {
  try {
    const id = req.params.id; // Mendapatkan parameter ID dari URL

    // Memanggil fungsi getById dari ModelTim
    const result = await ModelTim.getById(id);

    if (result) {
      // Jika data ditemukan, kembalikan data
      res.json(result);
    } else {
      // Jika data tidak ditemukan, kembalikan pesan error
      res.status(404).json({ error: "Data tim tidak ditemukan" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data tim" });
  }
});


router.get("/getopdterkait", async (req, res) => {
  try {
    // Panggil model untuk mendapatkan semua data dari database
    const rows = await ModelTim.getAll();

    // Ekstrak dan filter nilai unik dari opd_terkait
    const uniqueOpdTerkait = [
      ...new Set(rows.map((row) => row.opd_terkait).filter((opd) => opd)),
    ];

    res.json(uniqueOpdTerkait);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data opd_terkait" });
  }
});


router.post("/store", upload.single("ttd"), async function (req, res, next) {
  try {
    let { opd_terkait, nama_tim, group_tim, qr } = req.body;

    // Tambahkan pengecekan apakah file di-upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File ttd tidak ditemukan. Pastikan Anda mengunggah file.",
      });
    }

    let data = {
      opd_terkait,
      nama_tim,
      group_tim,
      ttd: `ttd/${req.file.filename}`,
      qr,
    };

    // Simpan data menggunakan ModelTim.Store
    const result = await ModelTim.Store(data);

    // Kirim respons sukses dalam format JSON
    res.status(200).json({
      success: true,
      message: "Berhasil menambah foto",
      result: result,
    });
  } catch (error) {
    console.error("Gagal menambah foto:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Gagal menambah foto",
      error: error.message,
    });
  }
});

// Rute untuk mendapatkan data tim berdasarkan ID
router.get("/get/:id", async function (req, res, next) {
  try {
    const id = req.params.id; // Ambil ID dari URL

    // Panggil metode getById dari ModelTim
    const dataTim = await ModelTim.getById(id);

    // Jika data tidak ditemukan, kembalikan respons 404
    if (!dataTim) {
      return res.status(404).json({
        success: false,
        message: "Data tim tidak ditemukan.",
      });
    }

    // Kembalikan respons sukses dengan data tim
    res.status(200).json({
      success: true,
      message: "Data tim ditemukan.",
      data: dataTim,
    });
  } catch (error) {
    console.error("Gagal mendapatkan data tim:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Gagal mendapatkan data tim.",
      error: error.message,
    });
  }
});

// Rute untuk memperbarui data tim
router.post("/update/:id", upload.single("ttd"), async function (req, res, next) {
  try {
    let { opd_terkait, nama_tim, group_tim, qr } = req.body;
    const id = req.params.id; // Ambil ID dari URL

    let data = {
      opd_terkait,
      nama_tim,
      group_tim,
      qr,
    };

    // Tambahkan logika untuk memeriksa apakah file di-upload
    if (req.file) {
      data.ttd = `ttd/${req.file.filename}`; // Jika file di-upload, tambahkan ke data
    }

    // Perbarui data menggunakan ModelTim.Update
    const result = await ModelTim.Update(id, data);

    // Kirim respons sukses dalam format JSON
    res.status(200).json({
      success: true,
      message: "Berhasil memperbarui foto",
      result: result,
    });
  } catch (error) {
    console.error("Gagal memperbarui foto:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui foto",
      error: error.message,
    });
  }
});

router.get("/group_tim", async (req, res) => {
  try {
    const opdTerkait = req.query.opd_terkait; // Mengambil query parameter dari request

    if (!opdTerkait) {
      return res.status(400).json({ error: "Parameter opd_terkait diperlukan" });
    }

    // Mengambil group_tim berdasarkan opd_terkait
    const groupTimList = await ModelTim.getGroupTimByOpd(opdTerkait);

    res.json(groupTimList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil group_tim" });
  }
});

// Rute untuk menghapus data tim
router.delete("/delete/:id", async function (req, res, next) {
  try {
    const id = req.params.id; // Ambil ID dari URL

    // Ambil data lama untuk mendapatkan nama file lama
    const existingData = await ModelTim.getById(id); // Anda perlu membuat metode getById di model

    // Hapus data dari database
    const result = await ModelTim.Delete(id);

    // Hapus file yang terkait jika ada
    if (existingData && existingData.ttd) {
      const filePath = path.join(__dirname, "..", "public", existingData.ttd); // Path file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Gagal menghapus file:", err);
        }
      });
    }

    // Kirim respons sukses dalam format JSON
    res.status(200).json({
      success: true,
      message: "Berhasil menghapus tim",
      result: result,
    });
  } catch (error) {
    console.error("Gagal menghapus tim:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus tim",
      error: error.message,
    });
  }
});

module.exports = router;

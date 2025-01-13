var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");
const ModelLokasi = require("../model/model_lokasi.js");
const moment = require('moment');
const axios = require('axios');

// Mendapatkan semua lokasi
router.get("/getall", async (req, res) => {
  try {
    let rows = await ModelLokasi.getAll();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data lokasi" });
  }
});

// Mendapatkan lokasi berdasarkan ID
router.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let row = await ModelLokasi.getById(id);
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal mengambil data berdasarkan ID" });
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { tanggal_selesai, laporan, tim, jumlah_tim } = req.body;

    // Memastikan bahwa data yang diperlukan ada
    if (!tanggal_selesai || !laporan || !tim || !jumlah_tim) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    // Memperbarui data lokasi
    const result = await ModelLokasi.Update(id, { tanggal_selesai, laporan, tim, jumlah_tim });

    if (result.affectedRows > 0) {
      res.json({ message: "Data lokasi berhasil diperbarui" });
    } else {
      res.status(404).json({ error: "Data tidak ditemukan" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gagal memperbarui data lokasi" });
  }
});

router.post("/klaim_mamin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Mendapatkan hari dalam bahasa Inggris
    const englishDay = moment().format('dddd');

    // Pemetaan hari dalam bahasa Inggris ke bahasa Indonesia
    const daysMapping = {
      Sunday: "Minggu",
      Monday: "Senin",
      Tuesday: "Selasa",
      Wednesday: "Rabu",
      Thursday: "Kamis",
      Friday: "Jumat",
      Saturday: "Sabtu",
    };

    // Terjemahkan hari dan format tanggal
    const translatedDay = daysMapping[englishDay];
    const formattedDate = moment().format('DD MMMM YYYY HH:mm');

    // Gabungkan hari yang diterjemahkan dengan sisa tanggal yang diformat
    const klaim_mamin = `${translatedDay}, ${formattedDate}`;

    // Perbarui hanya kolom klaim_mamin
    const result = await ModelLokasi.Klaim(id, { klaim_mamin });

    // Cek hasil update
    if (result.affectedRows > 0) {
      // Kirim pesan ke grup WhatsApp menggunakan Fonnte setelah update berhasil
      const message = `Mamin berhasil di klaim pada tanggal: ${klaim_mamin}`;
      const groupChatId = '120363351627139286@g.us'; // Ganti dengan ID grup WhatsApp Anda
      const apiKey = 'PTgBCAeKodUPvd5MuCmD'; // Token Anda

      // Panggilan API Fonnte untuk mengirim pesan
      const response = await axios.post('https://api.fonnte.com/send', {
        target: groupChatId,
        message: message,
      }, {
        headers: {
          'Authorization': `${apiKey}`,
          'Content-Type': 'application/json',
        }
      });

      // Log respon dari API untuk debugging
      console.log(response.data);

      // Cek respon dari pengiriman pesan
      if (response.data.status) {
        res.json({ message: "Klaim mamin berhasil diperbarui dan pesan dikirim ke grup", klaim_mamin });
      } else {
        res.status(500).json({ error: `Pesan gagal dikirim ke grup: ${response.data.reason}` });
      }
    } else {
      res.status(404).json({ error: "Data lokasi tidak ditemukan" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal memperbarui klaim mamin" });
  }
});




module.exports = router;

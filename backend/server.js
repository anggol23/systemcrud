const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('./db_config'); // Pastikan jalur file db_config.js benar

const app = express();
const port = 5000;

// Middleware untuk menangani JSON
app.use(express.json());

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Menambahkan timestamp untuk menghindari nama file yang sama
  }
});
const upload = multer({ storage: storage });

// Endpoint untuk menambahkan produk baru
app.post('/api/products', upload.single('foto'), async (req, res) => {
  const { nama_baju, harga } = req.body;
  const foto = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      'INSERT INTO products (nama_baju, harga, foto) VALUES ($1, $2, $3) RETURNING *',
      [nama_baju, harga, foto]
    );
    console.log('Produk berhasil ditambahkan:', result.rows[0]); // Log ke terminal
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding product:', err.message); // Log kesalahan ke terminal
    res.status(500).json({ error: 'Error adding product' });
  }
});

// Endpoint untuk mendapatkan semua produk
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err.message); // Log kesalahan ke terminal
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Menyajikan file statis dari folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Middleware untuk meng-parse JSON
app.use(express.json());

// Endpoint untuk menerima dan menjalankan kode C++
app.post('/run-cpp', (req, res) => {
  const code = req.body.code; // Kode C++ dikirim dari frontend

  // Menyimpan kode C++ dalam file sementara
  fs.writeFileSync('temp.cpp', code);

  // Menjalankan file C++ menggunakan g++
  exec('g++ temp.cpp -o temp && ./temp', (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(`Error: ${stderr}`);
    } else {
      res.send(stdout); // Mengirimkan hasil eksekusi ke frontend
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

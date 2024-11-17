const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const port = 3000;

// Middleware untuk mengurai body JSON
app.use(bodyParser.json());

// Endpoint untuk menerima kode C++ dan menjalankannya
app.post("/run", (req, res) => {
  const code = req.body.code; // Mendapatkan kode C++ dari body request

  // Membuat file C++ sementara
  const fileName = "temp.cpp";
  fs.writeFileSync(fileName, code, "utf8");

  // Mengkompilasi file C++ menggunakan g++
  exec(`g++ ${fileName} -o temp`, (err, stdout, stderr) => {
    if (err) {
      // Jika terjadi kesalahan saat kompilasi
      return res.status(500).send({ error: stderr });
    }

    // Menjalankan program C++ yang telah dikompilasi
    exec("./temp", (err, stdout, stderr) => {
      if (err) {
        return res.status(500).send({ error: stderr });
      }

      // Mengirimkan output ke klien
      res.send({ output: stdout });
    });
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

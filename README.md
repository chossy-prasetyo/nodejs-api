# API user sederhana menggunakan nodejs

Package : express, mysql2, dotenv

# Instal

- Inisiasi project menggunakan npm : npm init -y
- Buka file package.json, pastikan key "main" memiliki value "app.js"
- Instal 3 package di atas
- Siapkan database mysql dengan tabel users yang terdiri dari kolom : id (int, AI), nama (varchar: 100), email (varchar: 100), deleted_at (datetime, NULL)
- Buat file .env dengan struktur yang dapat dilihat pada file .env-example dan isi dengan value yang sesuai
- Selesai, API siap dipakai
- Dokumentasi api dan respon json dapat dilihat [Di Sini](https://penjualan.chossy.me/inovamedika-test)

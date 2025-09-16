# Proyek Manufaktur - Frontend (Vue.js)

Antarmuka pengguna (UI) ini dibangun menggunakan Vue.js, Vite, dan Tailwind CSS untuk berinteraksi dengan API backend manufaktur.

## 🚀 Cara Menggunakan

**1. Instalasi**
- Pastikan Anda memiliki Node.js (v18+) terinstal.
- Clone repository ini.
- Buka terminal di dalam folder proyek dan jalankan `npm install` untuk menginstal semua dependensi.

**2. Konfigurasi**
- Buka file `src/api.js`.
- Sesuaikan `baseURL` agar sesuai dengan alamat API backend Anda (default: `http://127.0.0.1:8000/api`).

**3. Menjalankan Aplikasi**
- Pastikan server backend Laravel Anda sedang berjalan.
- Di terminal proyek frontend, jalankan perintah:
  ```bash
  npm run dev
  ```
- Buka browser Anda dan kunjungi alamat yang tertera (biasanya `http://localhost:5173`).

---
## 🌊 Alur Penggunaan Aplikasi

1.  **Login**: Pengguna harus login terlebih dahulu menggunakan akun yang sesuai dengan perannya (Manajer, Staff PPIC, atau Staff Produksi).
2.  **Dashboard**: Setelah login, pengguna akan diarahkan ke Dashboard.
    - **Manajer** akan melihat menu visual (seperti Odoo) untuk memilih modul.
    - **Peran lain** akan melihat pesan selamat datang dan menggunakan sidebar untuk navigasi.
3.  **Navigasi**: Gunakan menu di sidebar kiri untuk berpindah antar halaman sesuai dengan hak akses peran Anda.
4.  **Notifikasi**: Ikon lonceng 🔔 di kanan atas akan menampilkan notifikasi *real-time* untuk setiap kejadian penting.

---
## ✨ Fitur-Fitur

Aplikasi ini memiliki fitur yang disesuaikan untuk setiap peran:

### Untuk Manajer
- **Dashboard Visual**: Menu utama dengan ikon untuk akses cepat ke modul.
- **Persetujuan Rencana**: Halaman khusus untuk melihat, menyetujui, atau menolak rencana produksi yang diajukan oleh PPIC.
- **Monitoring Produksi**: Dapat melihat daftar semua order produksi dan status pengerjaannya secara *real-time*.
- **Notifikasi**: Menerima notifikasi saat ada rencana baru, dan saat status order produksi diubah oleh tim produksi.

### Untuk Staff PPIC
- **Dashboard PPIC**: Halaman utama untuk membuat Rencana Produksi baru dengan memilih produk dari master data, menentukan jumlah, dan target tanggal selesai.
- **Riwayat Rencana**: Melihat tabel berisi semua rencana yang pernah dibuat beserta status terakhirnya (Menunggu, Disetujui, Ditolak).
- **Log & Laporan**: Halaman log untuk memfilter riwayat rencana produksi berdasarkan periode (harian, mingguan, bulanan) dan mengekspornya ke format PDF.
- **Notifikasi**: Menerima notifikasi saat rencananya disetujui atau ditolak oleh manajer.

### Untuk Staff Produksi
- **Dashboard Produksi**: Melihat daftar Order Produksi yang telah disetujui dan siap dikerjakan.
- **Update Status Order**:
    - **Mulai Kerjakan**: Mengubah status order menjadi `sedang_dikerjakan`.
    - **Selesaikan**: Mengubah status order menjadi `selesai` sambil menginput jumlah hasil aktual dan jumlah produk yang ditolak (reject).
    - **Serahkan ke Gudang**: Mengubah status order menjadi `diserahkan_ke_gudang`.
- **Log & Laporan**: Halaman log untuk melihat riwayat semua order produksi, memfilternya, dan mengekspornya ke format PDF. Riwayat detail setiap perubahan status (logs) juga dapat dilihat di sini.
- **Notifikasi**: Menerima notifikasi saat ada order produksi baru yang masuk.

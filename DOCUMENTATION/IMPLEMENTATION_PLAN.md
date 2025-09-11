# Dokumen Rencana Implementasi Bertahap: Proyek RENTVERSE

**Versi: 1.0**
**Tanggal: 8 September 2025**
**Status: Disetujui**

---

## 1. Pengantar

### 1.1. Tujuan Dokumen

Dokumen ini menguraikan peta jalan strategis untuk pengembangan proyek RENTVERSE. Tujuannya adalah untuk memecah proses pengembangan yang kompleks menjadi beberapa fase yang dapat dikelola, masing-masing dengan tujuan yang jelas dan hasil yang terukur. Pendekatan ini memungkinkan pengembangan yang iteratif, pengujian yang terfokus, dan peluncuran fungsionalitas secara bertahap.

### 1.2. Metodologi

Pengembangan akan mengikuti pendekatan berbasis **MVP (Minimum Viable Product)**, di mana fungsionalitas inti akan dibangun terlebih dahulu, diikuti oleh fitur-fitur lanjutan di fase berikutnya.

---

## 2. Peta Jalan Pengembangan

### Fase 1: MVP - Alur Kerja Inti Agen (Fokus pada Challenge 1 Basic)

**Tujuan**: Menciptakan fungsionalitas dasar di mana seorang `AGENT` dapat berhasil mendaftar, login, dan mengajukan properti baru ke dalam sistem.

**Tugas-tugas Utama**:

1.  **Pengaturan Awal Proyek**:

    - Membuat _monorepo_ (misalnya menggunakan Turborepo) atau _repository_ terpisah untuk setiap layanan (`frontend`, `core-service`, `prediction-service`).
    - Menginisialisasi proyek untuk `Core Service` (Express.js) dan `Frontend` (Next.js).
    - Menyiapkan Docker & Docker Compose untuk lingkungan pengembangan lokal.

2.  **Pengembangan `Core Service` (Backend)**:

    - Mengimplementasikan skema database di Prisma (tabel `Users`, `Projects`, `Properties`).
    - Membuat endpoint API untuk:
      - Registrasi Pengguna (`POST /auth/register`).
      - Login Pengguna (`POST /auth/login`) dengan pembuatan JWT.
      - Mengambil daftar proyek untuk auto-fill (`GET /projects`).
      - Menyimpan properti baru dengan status `PENDING` (`POST /properties`).

3.  **Pengembangan `Frontend` (UI)**:
    - Membuat halaman Login dan Registrasi.
    - Membangun komponen Formulir Pengajuan Properti yang lengkap sesuai _wireframe_.
    - Mengintegrasikan formulir dengan semua endpoint API yang relevan dari _Core Service_.
    - Mengimplementasikan logika _state management_ dan auto-fill.

**Hasil yang Diharapkan di Akhir Fase 1**:

- Sebuah aplikasi web fungsional di mana seorang agen dapat membuat akun, login, dan berhasil mengirimkan data properti baru yang tersimpan di database.

---

### Fase 2: Dasbor Admin & Alur Persetujuan (Fokus pada Challenge 1 Advanced)

**Tujuan**: Membangun fungsionalitas penuh bagi `ADMIN` untuk mengelola dan memoderasi properti yang masuk.

**Tugas-tugas Utama**:

1.  **Pembaruan `Core Service`**:

    - Mengimplementasikan _middleware_ otorisasi berbasis peran untuk melindungi endpoint khusus Admin.
    - Membuat endpoint API untuk:
      - Mengambil daftar properti dengan status `PENDING` (`GET /properties/pending`).
      - Memperbarui status properti menjadi `APPROVED` atau `REJECTED` (`PATCH /properties/:id/status`).

2.  **Pembaruan `Frontend`**:
    - Membuat halaman Dasbor Admin yang dilindungi (hanya bisa diakses oleh Admin).
    - Membangun antarmuka tabel yang menampilkan data properti yang `PENDING`.
    - Mengimplementasikan fungsionalitas pada tombol "Approve" dan "Reject" untuk memanggil API yang sesuai.

**Hasil yang Diharapkan di Akhir Fase 2**:

- Alur kerja lengkap dari pengajuan properti oleh agen hingga persetujuan oleh admin telah berfungsi sepenuhnya. Properti yang disetujui siap untuk ditampilkan secara publik.

---

### Fase 3: Integrasi Layanan Prediksi Harga (Fokus pada Challenge 2)

**Tujuan**: Mengintegrasikan layanan AI untuk memberikan rekomendasi harga secara _real-time_ kepada agen.

**Tugas-tugas Utama**:

1.  **Pengembangan `Prediction Service` (Backend)**:

    - Menginisialisasi proyek FastAPI (Python).
    - Membangun model Machine Learning sederhana (misalnya Regresi Linier) dan melatihnya dengan data sampel.
    - Membuat endpoint API `/predict` sesuai kontrak OpenAPI.

2.  **Pengaturan API Gateway**:

    - Mengkonfigurasi API Gateway (Kong) untuk merutekan permintaan ke `Core Service` dan `Prediction Service` dengan benar.

3.  **Pembaruan `Frontend`**:
    - Memodifikasi komponen Formulir Pengajuan Properti untuk memanggil API `/predict` secara dinamis.
    - Mengimplementasikan teknik _debounce_ untuk mencegah panggilan API yang berlebihan.
    - Menampilkan hasil prediksi secara jelas di dalam antarmuka formulir.

**Hasil yang Diharapkan di Akhir Fase 3**:

- Fitur asisten harga cerdas telah terintegrasi dan berfungsi, memberikan nilai tambah signifikan bagi agen.

---

### Fase 4: Generator Dokumen & Fitur Tambahan (Fokus pada Challenge 3)

**Tujuan**: Melengkapi aplikasi dengan fungsionalitas pembuatan kontrak sewa otomatis dan fitur pendukung lainnya.

**Tugas-tugas Utama**:

1.  **Pembaruan `Core Service`**:

    - Mengimplementasikan logika dan endpoint API untuk mengelola data di tabel `RentalAgreements`.
    - Mengintegrasikan dengan library pembuat PDF (misalnya Puppeteer) untuk menghasilkan dokumen kontrak.

2.  **Pembaruan `Frontend`**:
    - Membangun antarmuka untuk memulai proses pembuatan kontrak (misalnya, di halaman detail properti).
    - Membuat halaman publik untuk menampilkan properti yang sudah disetujui, lengkap dengan fitur pencarian dan filter.

**Hasil yang Diharapkan di Akhir Fase 4**:

- Semua fungsionalitas inti dari ketiga tantangan telah selesai, terintegrasi, dan aplikasi siap untuk rilis versi pertama.

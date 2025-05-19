export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <h1>About This App</h1>
        <p>Aplikasi ini dibuat sebagai tugas Submission 1 Belajar Pengembangan Web Intermediate.</p>
        <p>Fungsi utama aplikasi adalah untuk menampilkan dan menambahkan story dengan foto dan lokasi pada peta menggunakan API Dicoding Story.</p>
        <p>Aplikasi dibangun menggunakan JavaScript modern dengan arsitektur Single Page Application (SPA) dan pola Model-View-Presenter (MVP).</p>
        <p>Fitur lain termasuk autentikasi pengguna, upload foto dengan kamera atau file, serta peta interaktif menggunakan Leaflet dan OpenStreetMap.</p>
        <h3>Dibuat oleh:</h3>
        <ul>
          <li>Nama: <strong>Ulfiani Latifah</strong></li>
          <li>Kelas: <strong>FC-32</strong></li>
          <li>Cohort ID: <strong>FC312D5X1540</strong></li>
        </ul>
      </section>
    `;
  }

  async afterRender() {
    // Tidak ada
  }
}
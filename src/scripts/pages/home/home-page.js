import { StoryModel } from '../../data/story-model.js';
import { HomePagePresenter } from './home-presenter.js';
import { storeStoryData } from '../../indexedDB.js';  // Impor fungsi untuk menyimpan data ke IndexedDB
import { getStoredStories } from '../../indexedDB.js';  // Pastikan ini ada


export default class HomePage {
  constructor() {
    this.presenter = null;
    this.token = null;
    this.stream = null;
    this.map = null;
    this.marker = null; // marker lokasi yang dipilih user
  }

  async render() {
    return `
      <section class="container">
        <h1>Daftar Story Dicoding</h1>
        <div id="story-list"></div>

        <div id="map" style="height: 400px; margin-top: 2rem; border: 1px solid #ccc;"></div>

        <form id="add-story-form" aria-label="Form tambah story" style="margin-top: 1rem;">
          <label for="description">Deskripsi:</label>
          <textarea id="description" placeholder="Deskripsi cerita..." required></textarea>

          <div style="margin-top: 0.5rem;">
  <label for="photo-upload" class="visually-hidden">Upload Foto</label>
  <button type="button" id="btn-upload">Upload Foto</button>
  <label for="photo-camera" class="visually-hidden">Gunakan Kamera</label>
  <button type="button" id="btn-camera">Gunakan Kamera</button>
</div>

<input type="file" id="photo-upload" accept="image/*" style="display:block; margin-top: 0.5rem;" aria-describedby="upload-desc" />
<span id="upload-desc" class="visually-hidden">Pilih file foto untuk diupload</span>

<div id="camera-container" style="display:none; margin-top: 0.5rem;">
  <video id="video" width="320" height="240" autoplay></video>
  <button type="button" id="capture-button">Ambil Foto</button>
  <canvas id="canvas" width="320" height="240" style="display:none; border:1px solid #ccc; margin-top: 0.5rem;"></canvas>
</div>

<input type="file" id="photo-camera" accept="image/*" style="display:none;" aria-describedby="camera-desc" />
<span id="camera-desc" class="visually-hidden">Foto hasil kamera siap dikirim</span>

          <div style="margin-top: 1rem;">
            <label for="location">Klik peta untuk pilih lokasi (opsional):</label>
            <input
              type="text"
              id="location"
              readonly
              placeholder="Latitude, Longitude"
              style="width: 100%; padding: 0.5rem; margin-top: 0.3rem;"
            />
          </div>

          <button type="submit" style="margin-top: 0.75rem;">Tambah Story</button>
        </form>

        <div id="message" role="alert" aria-live="polite" style="margin-top: 10px; color: red;"></div>
      </section>
    `;
  }

async afterRender() {
  // Cek apakah aplikasi dalam keadaan offline
  if (!navigator.onLine) {
    const storedStories = await getStoredStories(); // Mengambil data dari IndexedDB
    this.renderStories(storedStories);  // Menampilkan data dari IndexedDB saat offline
    return;
  }

  // Jika online, lanjutkan seperti biasa
  this.token = localStorage.getItem('dicoding_story_token') || '';
  if (!this.token) {
    const messageContainer = document.getElementById('message');
    messageContainer.innerHTML = `Silakan <a href="#/login" style="color: blue; text-decoration: underline;">login</a> terlebih dahulu.`;
    document.getElementById('add-story-form').style.display = 'none';
    return;
  }

  const model = new StoryModel(this.token);
  this.presenter = new HomePagePresenter(model, this);

  const stories = await this.presenter.loadStories();
  storeStoryData(stories);  // Menyimpan data ke IndexedDB

  this._initMap();
  this._addStoryMarkers(stories);

  // Setup klik peta untuk pilih lokasi
  this.map.on('click', (event) => {
    const { lat, lng } = event.latlng;

    if (this.marker) {
      this.marker.setLatLng(event.latlng);
    } else {
      this.marker = L.marker(event.latlng).addTo(this.map);
    }

    document.getElementById('location').value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  });

  this._setupFormHandlers();
}


  _initMap() {
    this.map = L.map('map').setView([-2.548926, 118.0148634], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  _addStoryMarkers(stories) {
    stories.forEach((story) => {
      if (story.lat != null && story.lon != null) {
        const lat = parseFloat(story.lat);
        const lon = parseFloat(story.lon);

        if (!isNaN(lat) && !isNaN(lon)) {
          const marker = L.marker([lat, lon]).addTo(this.map);
          marker.bindPopup(`
            <strong>${story.name}</strong><br />
            ${story.description}<br />
            <img src="${story.photoUrl}" alt="Foto Story" width="150" />
          `);
        }
      }
    });
  }

  _setupFormHandlers() {
    const btnUpload = document.getElementById('btn-upload');
    const btnCamera = document.getElementById('btn-camera');
    const photoUpload = document.getElementById('photo-upload');
    const photoCamera = document.getElementById('photo-camera');
    const cameraContainer = document.getElementById('camera-container');
    const video = document.getElementById('video');
    const captureButton = document.getElementById('capture-button');
    const canvas = document.getElementById('canvas');
    const form = document.getElementById('add-story-form');

    let usingCamera = false;

    photoUpload.style.display = 'block';
    cameraContainer.style.display = 'none';
    photoCamera.style.display = 'none';

    btnUpload.addEventListener('click', () => {
      usingCamera = false;
      this.stopStream();
      photoUpload.style.display = 'block';
      cameraContainer.style.display = 'none';
      photoCamera.style.display = 'none';
      this.renderSuccessMessage('Gunakan upload foto dari file.');
    });

    btnCamera.addEventListener('click', async () => {
      usingCamera = true;
      photoUpload.style.display = 'none';
      photoCamera.style.display = 'block';
      cameraContainer.style.display = 'block';

      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = this.stream;
        this.renderSuccessMessage('Kamera aktif, siap mengambil foto.');
      } catch (error) {
        console.error('Tidak bisa akses kamera:', error);
        this.renderFailedMessage('Tidak dapat mengakses kamera.');
      }
    });

    captureButton.addEventListener('click', () => {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.style.display = 'block';

      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-photo.png', { type: 'image/png' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoCamera.files = dataTransfer.files;
        this.renderSuccessMessage('Foto berhasil diambil dan siap dikirim.');
      }, 'image/png');
    });

    form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const description = document.getElementById('description').value.trim();

  // Validasi deskripsi minimal 10 karakter
  if (description.length < 10) {
    this.renderFailedMessage('Deskripsi minimal 3 karakter.');
    return;
  }

  let photoFile = usingCamera ? photoCamera.files[0] : photoUpload.files[0];

  if (!photoFile) {
    this.renderFailedMessage('Foto wajib diisi.');
    return;
  }

  // Validasi tipe file gambar
  if (!photoFile.type.startsWith('image/')) {
    this.renderFailedMessage('File yang dipilih harus berupa gambar.');
    return;
  }

  // Validasi ukuran maksimal 1MB
  if (photoFile.size > 1024 * 1024) {
    this.renderFailedMessage('Ukuran foto maksimal 1MB.');
    return;
  }

  // Validasi lokasi jika ada
  const locationValue = document.getElementById('location').value;
  let lat = null;
  let lon = null;
  if (locationValue) {
    const [latStr, lonStr] = locationValue.split(',').map(s => s.trim());
    lat = parseFloat(latStr);
    lon = parseFloat(lonStr);
    if (isNaN(lat) || isNaN(lon)) {
      this.renderFailedMessage('Lokasi yang dipilih tidak valid.');
      return;
    }
  }

  // Proses submit data
  try {
    await this.presenter.submitNewStory({ description, photo: photoFile, lat, lon });
    form.reset();
    this.stopStream();
    document.getElementById('location').value = '';
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
  } catch {
    this.renderFailedMessage('Gagal menambahkan story.');
  }
});

  }

  stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    const canvas = document.getElementById('canvas');
    if (canvas) canvas.style.display = 'none';
  }

  showLoading() {
  const container = document.getElementById('story-list');
  container.innerHTML = `<div class="spinner" role="status" aria-label="Loading"></div>`;
}

renderStories(stories) {
  const container = document.getElementById('story-list');
  container.innerHTML = '';

  stories.forEach((story) => {
    const storyEl = document.createElement('article');
    storyEl.classList.add('story-item');

    // Pastikan gambar diambil dari cache atau IndexedDB jika offline
    const photoUrl = story.photoUrl || '/images/default-photo.jpg'; // Default jika tidak ada foto

    storyEl.innerHTML = `
      <h2 style="margin-bottom: 0.25rem;">${story.name}</h2>
      <img src="${photoUrl}" alt="Foto Story oleh ${story.name}" width="250" style="display: block; margin-bottom: 0.5rem;" />
      <p style="margin-top: 0;">${story.description}</p>
      <time datetime="${story.createdAt}" style="font-size: 0.8rem; color: gray;">
        ${new Date(story.createdAt).toLocaleString()}
      </time>
    `;

    storyEl.style.marginBottom = '2rem';

    container.appendChild(storyEl);
  });
}


  renderFailedMessage(message = 'Gagal memuat data') {
    const msgEl = document.getElementById('message');
    msgEl.style.color = 'red';
    msgEl.innerText = message;
  }

  renderSuccessMessage(message) {
    alert(message);
  }
}



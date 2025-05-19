import { StoryModel } from '../../data/story-model.js';
import { HomePagePresenter } from './home-presenter.js';

export class HomePageView {
  constructor(token) {
    this.token = token;
    this.presenter = null;
  }

  render() {
    const container = document.getElementById('container');
    container.innerHTML = `
      <h1>Daftar Story Dicoding</h1>
      <div id="story-list"></div>
      <form id="add-story-form">
        <textarea id="description" placeholder="Deskripsi cerita..." required></textarea>
        <input type="file" id="photo" accept="image/*" required />
        <button type="submit">Tambah Story</button>
      </form>
      <div id="message"></div>
    `;
  }

  async afterRender() {
    const model = new StoryModel(this.token);
    this.presenter = new HomePagePresenter(model, this);

    await this.presenter.loadStories();

    const form = document.getElementById('add-story-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const description = document.getElementById('description').value;
      const photoInput = document.getElementById('photo');
      const photo = photoInput.files[0];
      if (!photo) {
        this.renderFailedMessage('Foto wajib diisi');
        return;
      }
      await this.presenter.submitNewStory({ description, photo, lat: null, lon: null });
      form.reset();
    });
  }

  showLoading() {
    document.getElementById('story-list').innerHTML = 'Loading...';
  }

  renderStories(stories) {
    const container = document.getElementById('story-list');
    container.innerHTML = '';
    stories.forEach((story) => {
      const storyEl = document.createElement('div');
      storyEl.classList.add('story-item');
      storyEl.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto Story oleh ${story.name}" width="150" />
        <p><strong>${story.name}</strong></p>
        <p>${story.description}</p>
        <p>${new Date(story.createdAt).toLocaleString()}</p>
      `;
      container.appendChild(storyEl);
    });
  }

  renderFailedMessage(msg = 'Gagal memuat data') {
    document.getElementById('message').innerText = msg;
  }

  renderSuccessMessage(msg) {
    document.getElementById('message').innerText = msg;
  }
}

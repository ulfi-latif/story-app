import { RegisterModel } from '../../data/register-model.js';
import { RegisterPresenter } from './register-presenter.js';

export default class RegisterPage {
  constructor() {
    this.presenter = null;
  }

  async render() {
    return `
      <section class="container">
        <h1>Daftar Akun</h1>
        <form id="register-form" aria-label="Form daftar akun">
          <label for="name">Nama:</label>
          <input type="text" id="name" required placeholder="Nama lengkap" />

          <label for="email">Email:</label>
          <input type="email" id="email" required placeholder="Email" />

          <label for="password">Password:</label>
          <input type="password" id="password" required minlength="8" placeholder="Minimal 8 karakter" />

          <button type="submit">Daftar</button>
        </form>
        <div id="message" role="alert" aria-live="polite"></div>
      </section>
    `;
  }

  async afterRender() {
    const model = new RegisterModel();
    this.presenter = new RegisterPresenter(model, this);

    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      await this.presenter.doRegister(name, email, password);
    });
  }

  showLoading() {
    document.getElementById('message').innerText = 'Memproses pendaftaran...';
  }

  renderRegisterSuccess(message) {
    document.getElementById('message').innerText = message + ' Silakan login.';
  }

  renderRegisterFailed(message) {
    document.getElementById('message').innerText = message;
  }
}

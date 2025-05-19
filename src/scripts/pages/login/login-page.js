import { LoginModel } from '../../data/login-model.js';
import { LoginPresenter } from './login-presenter.js';

export default class LoginPage {
  constructor() {
    this.presenter = null;
  }

  async render() {
    return `
      <section class="container">
        <h1>Login</h1>
        <form id="login-form" aria-label="Form login">
          <label for="email">Email:</label>
          <input type="email" id="email" required placeholder="Masukkan email" />
          
          <label for="password">Password:</label>
          <input type="password" id="password" required minlength="8" placeholder="Masukkan password" />
          
          <button type="submit">Login</button>
        </form>
        <div id="message" role="alert" aria-live="polite"></div>
      </section>
    `;
  }

  async afterRender() {
    const model = new LoginModel();
    this.presenter = new LoginPresenter(model, this);

    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      await this.presenter.doLogin(email, password);
    });
  }

  showLoading() {
    const msg = document.getElementById('message');
    msg.innerText = 'Memproses login...';
  }

  renderLoginSuccess(loginResult) {
    const msg = document.getElementById('message');
    msg.innerText = `Selamat datang, ${loginResult.name}!`;

    // Simpan token ke localStorage
    localStorage.setItem('dicoding_story_token', loginResult.token);

    // Redirect ke home page setelah 1 detik
    setTimeout(() => {
      window.location.hash = '#/';
    }, 1000);
  }

  renderLoginFailed() {
    const msg = document.getElementById('message');
    msg.innerText = 'Login gagal. Periksa email dan password.';
  }
}

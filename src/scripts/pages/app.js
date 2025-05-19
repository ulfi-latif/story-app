import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#setupLogout();
    this.#updateAuthLinksVisibility();

    // Update visibilitas tombol saat route berubah
    window.addEventListener('hashchange', () => {
      this.#updateAuthLinksVisibility();
      this.#setupLogout();
    });
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  #setupLogout() {
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
      logoutBtn.onclick = (event) => {
        event.preventDefault();
        localStorage.removeItem('dicoding_story_token');
        window.location.hash = '#/login';
        this.#updateAuthLinksVisibility();
      };
    }
  }

  #updateAuthLinksVisibility() {
    const token = localStorage.getItem('dicoding_story_token');

    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutBtn = document.getElementById('logout-button');

    if (token) {
      if (loginLink) loginLink.style.display = 'none';
      if (registerLink) registerLink.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
      if (loginLink) loginLink.style.display = 'inline-block';
      if (registerLink) registerLink.style.display = 'inline-block';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

async renderPage() {
  const url = getActiveRoute();
  const page = routes[url];

  this.#content.innerHTML = await page.render();

  this.#content.classList.remove('fade-in');
  void this.#content.offsetWidth; // trigger reflow supaya animasi bisa jalan ulang
  this.#content.classList.add('fade-in');

  await page.afterRender();

  // Update tombol login/logout setelah halaman render
  this.#updateAuthLinksVisibility();
  this.#setupLogout();
}

}

export default App;

export class LoginModel {
  async login(email, password) {
    const response = await fetch('https://story-api.dicoding.dev/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('LOGIN_FAILED');
    }
    const data = await response.json();
    return data.loginResult; // { userId, name, token }
  }
}

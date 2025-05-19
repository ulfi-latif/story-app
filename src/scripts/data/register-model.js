export class RegisterModel {
  async register(name, email, password) {
    const response = await fetch('https://story-api.dicoding.dev/v1/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      throw new Error('REGISTER_FAILED');
    }
    return await response.json();
  }
}

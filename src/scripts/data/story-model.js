export class StoryModel {
  constructor(token) {
    this.token = token;
  }

  async getStories(page = 1, size = 10) {
    const url = `https://story-api.dicoding.dev/v1/stories?page=${page}&size=${size}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    if (!response.ok) throw new Error('STORIES_FAILED_TO_GET');
    const data = await response.json();
    return data.listStory;
  }

  async addStory({ description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}` },
      body: formData,
    });
    if (!response.ok) throw new Error('FAILED_ADD_STORY');
    return await response.json();
  }
}

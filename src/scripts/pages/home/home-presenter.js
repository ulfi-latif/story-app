export class HomePagePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async loadStories() {
    try {
      this.view.showLoading();
      const stories = await this.model.getStories();
      this.view.renderStories(stories);
      return stories; // <-- tambahkan ini
    } catch {
      this.view.renderFailedMessage();
      return []; // agar selalu return array walaupun gagal
    }
  }

  async submitNewStory(data) {
    try {
      this.view.showLoading();
      await this.model.addStory(data);
      this.view.renderSuccessMessage('Story berhasil ditambahkan!');
      await this.loadStories();
    } catch {
      this.view.renderFailedMessage('Gagal menambahkan story.');
    }
  }
}

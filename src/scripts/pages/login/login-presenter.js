export class LoginPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async doLogin(email, password) {
    try {
      this.view.showLoading();
      const loginResult = await this.model.login(email, password);
      this.view.renderLoginSuccess(loginResult);
    } catch {
      this.view.renderLoginFailed();
    }
  }
}

export class RegisterPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async doRegister(name, email, password) {
    try {
      this.view.showLoading();
      const result = await this.model.register(name, email, password);
      this.view.renderRegisterSuccess(result.message);
    } catch (error) {
      this.view.renderRegisterFailed('Register gagal, cek kembali data Anda.');
    }
  }
}

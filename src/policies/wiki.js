const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  new() {
    return this._isAdmin();
  }

  create() {
    return this.new();
  }

  edit() {
    return this.edit;
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}
const ApplicationPolicy = require("./application");
const Collaborator = require("../db/models").Collaborator;

module.exports = class WikiPolicy extends ApplicationPolicy {

  constructor(user, wiki, collaborator = null) {
    super(user, wiki);
    this.collaborator = collaborator;
  }

  _isCollaborator() {
    return this.collaborator;
  }

  new() {
    return this._isAdmin() || this._isPremium();
  }

  create() {
    return this.new();
  }

  show() {
    return this._isAdmin() || this._isOwner() || this._isCollaborator();
  }

  edit() {
    return this.show();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this._isOwner() || this._isAdmin();
  }
}
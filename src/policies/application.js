module.exports = class ApplicationPolicy {

    constructor(user, record) {
      this.user = user;
      this.record = record;
    }
  
    _isOwner() {
      return this.record && (this.record.userId == this.user.id);
    }
  
    _isStandard() {
      return this.user && this.user.role === 0;
    }
  
    _isAdmin() {
      return this.user && this.user.role === 1;
    }
  
    _isPremium() {
      return this.user && this.user.role === 2;
    }
  
    new() {
      return this.user != null;
    }
  
    create() {
      return this.new();
    }
  
    show() {
      return true;
    }
  
    edit() {
      return this.new() && this.record;
    }
  
    update() {
      return this.edit();
    }
  
    destroy() {
      return this.update();
    }
  }
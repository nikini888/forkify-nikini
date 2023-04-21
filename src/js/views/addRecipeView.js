import { Views } from './views';

class addRecipeView extends Views {
  _parentEl = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _addRecipeDiv = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = '🎉 Success update new recipe :D ';
  _isNewForm = true;
  constructor() {
    super();
    this._addHandlerHideWindow();
    this._addHandlerShowWindow();
  }
  toggleDiv() {
    this._overlay.classList.toggle('hidden');
    this._addRecipeDiv.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleDiv.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleDiv.bind(this));
    this._overlay.addEventListener('click', this.toggleDiv.bind(this));
  }
  addHandleSubmitForm(handle) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(this._parentEl));
      handle(data);
    });
  }
}

export default new addRecipeView();

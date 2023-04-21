import { Views } from './views';

class SearchView extends Views {
  _parentEl = document.querySelector('form.search');
  addHandleRender(handle) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handle();
    });
  }
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }
}

export default new SearchView();

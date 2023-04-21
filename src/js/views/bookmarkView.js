import { Views } from './views';
import previewView from './previewView';

class BookmarkView extends Views {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  addHandleRender(handle) {
    window.addEventListener('load', _ => {
      handle();
    });
  }
  _generateMarkup() {
    return this._data.map(item => previewView.render(item, false)).join('');
  }
}

export default new BookmarkView();

import { Views } from './views';
import previewView from './previewView.js';
class ResultsView extends Views {
  _parentEl = document.querySelector('.results');
  _errorMessage = "Something went wrong! Can't load result. ";
  _generateMarkup() {
    return this._data.map(item => previewView.render(item, false)).join('');
  }
  recipeOnRender(id) {
    const previewEls = document.querySelectorAll('.preview__link');
    if (!previewEls || previewEls.length === 0) return;
    previewEls.forEach(item => {
      if (!item.classList.contains('preview__link--active')) return;
      item.classList.remove('preview__link--active');
    });
    const onShow = [...previewEls].find(item => item.href.split('#')[1] === id);

    onShow?.classList.add('preview__link--active');
  }
}
export default new ResultsView();

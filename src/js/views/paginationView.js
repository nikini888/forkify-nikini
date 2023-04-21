import { Views } from './views';
import icons from '../../img/icons.svg';
import { RESULTS_PERPAGE } from '../config';

class PaginationView extends Views {
  _parentEl = document.querySelector('.pagination');
  _generateMarkupButton(type) {
    const goto = type === 'next' ? this._data.page + 1 : this._data.page - 1;
    return `<button class="btn--inline pagination__btn--${type}" data-goTo="${goto}">
        <span>Page ${goto}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${
      type === 'next' ? 'right' : 'left'
    }"></use>
        </svg>
      </button>`;
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / RESULTS_PERPAGE);

    //One page results
    if (numPages <= 1) return;
    //2 pages results, on page one
    if (currentPage === 1) {
      return this._generateMarkupButton('next');
    }
    //middle page
    if (currentPage === numPages) {
      return this._generateMarkupButton('prev');
    }
    //last page
    return (
      this._generateMarkupButton('prev') + this._generateMarkupButton('next')
    );
  }
  addHandleRender(handle) {
    this._parentEl.addEventListener('click', e => {
      e.preventDefault();
      const button = e.target.closest('button');
      if (!button) return;

      const gotoPage = +button.dataset.goto;

      handle(gotoPage);
    });
  }
}

export default new PaginationView();

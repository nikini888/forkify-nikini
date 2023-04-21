import icons from '../../img/icons.svg';

export class Views {
  _parentEl;
  _data;
  _id;
  _errorMessage = 'No recipes found for your query. Please try again! :)';
  _message = '';
  /**
   * Rendering new DOM
   * @param {Object | Object[]} data The data to be render
   * @param {boolean} render If false, create markup instead of rendering DOM
   * @returns {string | undefined} The string return when render = true
   * @this {Object} View instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  /**
   * Update the DOME
   * @param {Object | Object[]} data The data to be update
   * @return {undefined}
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    //Create Node from newMarkup
    const newDom = document.createRange().createContextualFragment(newMarkup);

    //Select all node
    const newNodes = [...newDom.querySelectorAll('*')];
    const currentNodes = [...this._parentEl.querySelectorAll('*')];
    currentNodes.forEach((node, i) => {
      const newNode = newNodes[i];

      //Remove node dont have content
      if (node.isEqualNode(newNode)) return;
      else {
        //Add attribute to node either has content or not
        Array.from(newNode.attributes).forEach(attr =>
          node.setAttribute(attr.name, attr.value)
        );
        //Change content of node
        if (node.firstChild?.nodeValue.trim() !== '') {
          node.textContent = newNode.textContent;
        }
      }
    });
  }
  _clear() {
    this._parentEl.innerHTML = '';
  }
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  renderSpinner() {
    const markup = ` 
        <div class="spinner">
            <svg>
            <use href="${icons}#icon-loader"></use>
            </svg>
        </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  getPageId(id) {
    this._id = id;
  }
}

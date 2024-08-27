import icons from 'url:../../img/icons.svg'; // --> parcel-2

export default class View {
  // jsdoc comments
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @todo Finish implementation
   */
  _data;
  render(data, render = true) {
    // if (!data) return this.renderError();=> this applies only for data even if array is 0 it will display data
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // Check if _parentEl is not null
    if (!this._parentEl) {
      // console.error('Parent element not found');
      this.renderError();
      return;
    }

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup(); // Generate the new markup
    const newDOM = document.createRange().createContextualFragment(newMarkup); // Create a virtual DOM
    const newElements = Array.from(newDOM.querySelectorAll('*')); // Convert NodeList to Array
    const currentElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const currentEl = currentElements[i];

      // Update changed TEXT
      if (
        !newEl.isEqualNode(currentEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' // Check if the new element's text is different
      ) {
        currentEl.textContent = newEl.textContent;
      }

      // Update changed ATTRIBUTES
      if (!newEl.isEqualNode(currentEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          currentEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    // before adding new thing in recipeContainer removing the old ones
    // console.log(this._parentEl); // Debug line to see if _parentEl is null
    if (!this._parentEl) return;
    this._parentEl.innerHTML = '';
  }

  /// for spinner
  renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(message = this._successMessage) {
    const markup = `<div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="message">
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

  // search
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearQuery();
    return query;
  }

  _clearQuery() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}

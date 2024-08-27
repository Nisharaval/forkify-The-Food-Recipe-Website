import View from './View';

class searchView extends View {
  _parentEl = document.querySelector('.search');

  addHandlerSearch(searchhandler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      searchhandler();
    });
  }
}

export default new searchView();

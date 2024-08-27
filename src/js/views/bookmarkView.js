import View from './View';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class bookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _successMessage = 'Bookmarked successfully';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // _generateMarkup() {
  //   // console.log('Data to generate markup:', this._data); // Debug line
  //   return this._data.map(this._generateMarkupPreview).join('');
  // }

  // _generateMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);
  //   return `
  //     <li class="preview">
  //       <a class="preview__link ${
  //         result.id === id ? 'preview__link--active' : ''
  //       }" href="#${result.id}">
  //         <figure class="preview__fig">
  //           <img src="${result.image}" alt="${result.title}" />
  //         </figure>
  //         <div class="preview__data">
  //           <h4 class="preview__title">${result.title}</h4>
  //           <p class="preview__publisher">${result.publisher}</p>
  //         </div>
  //       </a>
  //     </li>`;
  // }

  _generateMarkup() {
    return this._data
      .map(bookmarkresult => previewView.render(bookmarkresult, false))
      .join('');
  }
}

export default new bookmarkView();

// import View from './View';
// import icons from 'url:../../img/icons.svg'; // --> parcel-2

// class resultsview extends View {
//   _parentEl = document.querySelector('.results');
//   _errorMessage = 'No recipes found.';
//   _successMessage = 'Happy Cooking';

//   _generateMarkup() {
//     // console.log(this._data)
//     return this._data.map(this._generateMarkupPreview).join('');
//   }

//   _generateMarkupPreview(result) {
//     const id = window.location.hash.slice(1);
//     return `      <li class="preview">
//             <a class="preview__link ${
//               result.id === id ? 'preview__link--active' : ''
//             }" href="#${result.id}">
//               <figure class="preview__fig">
//                 <img src="${result.image}" alt="${result.title}" />
//               </figure>
//               <div class="preview__data">
//                 <h4 class="preview__title">${result.title}</h4>
//                 <p class="preview__publisher">${result.publisher}</p>

//               </div>
//             </a>

//           </li>   `;
//   }
// }

// export default new resultsview();

import View from './View';
import previewView from './previewView'; // Import the common previewView class
import icons from 'url:../../img/icons.svg'; // Parcel 2

class resultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _successMessage = '';

  _generateMarkup() {
    // Use the previewView to generate markup for each result
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultsView();

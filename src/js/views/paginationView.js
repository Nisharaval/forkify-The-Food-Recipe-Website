import View from './View';
import icons from 'url:../../img/icons.svg'; // --> parcel-2

class paginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return; // If no button is clicked, exit the function
      console.log(btn);

      const gotoPage = +btn.dataset.goto; //=> its a string please convert it into number using + infront of it
      console.log(`Current Page${gotoPage}`);
      handler(gotoPage);
    });
  }

  // ####################################################################################

  // Function to create the pagination button markup
  _generateMarkupButton(page, type) {
    return `
      <button data-goto='${page}' class="btn--inline pagination__btn--${type}">
        ${
          type === 'prev'
            ? `
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${page}</span>
        `
            : `
          <span>Page ${page}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        `
        }
      </button>
    `;
  }

  _generateMarkup() {
    console.log(this._data);
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(`Total pages ${numPages}`);

    const currentPage = this._data.page;

    // ####################################################################################
    // page 1 with other pages
    if (currentPage === 1 && numPages > 1) {
      // Only show the 'Next' button on the first page
      return this._generateMarkupButton(currentPage + 1, 'next');
    }
    // return `<button class="btn--inline pagination__btn--next">
    //        <span>Page ${currentPage + 1}</span>
    //        <svg class="search__icon">
    //          <use href="${icons}#icon-arrow-right"></use>
    //        </svg>
    //      </button> `;

    // ####################################################################################

    //last page
    if (currentPage === numPages && numPages > 1) {
      // Only show the 'Previous' button on the last page
      return this._generateMarkupButton(currentPage - 1, 'prev');
    }
    // return `<button class="btn--inline pagination__btn--prev">
    //      <svg class="search__icon">
    //        <use href="${icons}#icon-arrow-left"></use>
    //       </svg>
    //       <span>Page ${currentPage - 1}</span>
    //      </button>`;

    // ####################################################################################
    // Other page
    if (currentPage < numPages) {
      // Show both 'Previous' and 'Next' buttons for all middle pages
      return (
        this._generateMarkupButton(currentPage - 1, 'prev') +
        this._generateMarkupButton(currentPage + 1, 'next')
      );
    }
    // return `
    //     <button class="btn--inline pagination__btn--prev">
    //      <svg class="search__icon">
    //        <use href="${icons}#icon-arrow-left"></use>
    //       </svg>
    //       <span>Page ${currentPage - 1}</span>
    //      </button>
    //      <button class="btn--inline pagination__btn--next">
    //        <span>Page ${currentPage + 1}</span>
    //        <svg class="search__icon">
    //          <use href="${icons}#icon-arrow-right"></use>
    //        </svg>
    //      </button> `;

    // ####################################################################################

    // Only one page exists, no buttons are needed
    return 'No more Results';
    // return ` <button class="btn--inline pagination__btn">

    //         <span>Last Page</span>
    //        </button>`;
  }
}
export default new paginationView();

import View from './View';
import icons from 'url:../../img/icons.svg'; // --> parcel-2

class addrecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe'); //=> related to overlay & window
  _btnClose = document.querySelector('.btn--close-modal');
  _errorMessage = '';
  _successMessage = 'New Recipe has been added sucessfully';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
    // this._addHandlerUpload();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    //=> there is no need to call this sin controller bcz it is not needed it will run as soon as the progrm is loaded so make use of constructor
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
  }

  // to submit form

  addHandlerUpload(handler) {
    //  Add an event listener to the form element.
    this._parentEl.addEventListener('submit', function (e) {
      //  Prevent the default form submission behavior.
      e.preventDefault();

      // Line 3: Create a new FormData Array of data from the form element (this refers to the form in the event listener's context).
      const dataArr = [...new FormData(this)];

      // takes array and converts into Object
      const data = Object.fromEntries(dataArr);
      // Log the collected form data (as an array of key-value pairs) to the console.
      // console.log(data);

      //  Call the handler function, passing the form data as an argument.
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new addrecipeView(); // import this in controller

// import icons from '../img/icons.svg'; --> parcel-1
// import icons from 'url:../img/icons.svg'; // --> parcel-2

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import previewView from './views/previewView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_TIME_OUT } from './config.js';
// import icons from 'url:../img/icons.svg'; // --> parcel-2

// console.log(icons);
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// parcel method // Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    let id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();
    // recipeView.renderSuccess();

    //0.Update Result view to mark selected search results
    // resultsView.render(model.getSearchResultsPage()); => we dont use render method here bcz everything is reloading
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);

    //1. Loading Recipes
    await model.loadRecipe(id);
    // console.log(`The recipe id is ${id}`);=> if result array contains more than one
    // Make an API request to fetch the recipe => check model.js

    // 2.rendering recipes
    recipeView.render(model.state.recipe); // this is my view
  } catch (err) {
    // Handle any errors that occur during the fetch operation
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1. Get the search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2. Render initial spinner
    resultsView.renderSpinner();

    // 3. Load search results
    await model.loadSearchResults(query);
    // console.log(model.state.search.results);
    console.log('Search Results:', model.state.search.results); // Debugging line

    // 4. Render search results
    // resultsView.render(model.state.search.results); => this displays all recipe details
    resultsView.render(model.getSearchResultsPage()); //=> this displays 10 recipe details as per Pagination

    //5. render pagination
    paginationView.render(model.state.search); //=>  search: {query: '',results: [],resultsPerPage: Pagination,page: 1, },
    // paginationView.render(model.getSearchResultsPage());
  } catch (err) {
    console.error(err);
  }
};
// controlSearchResults();

const controlSearchPagination = function (gotoPage) {
  // console.log('page controller');

  //  Render new search results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // render new pagination
  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  // update recipe serving (in state)
  model.updateServing(newServing);

  //update in view as well
  // recipeView.render(model.state.recipe); => check view once for FYI
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // addBookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
    alert(`${model.state.recipe.title} recipe has been Bookmarked`);

    console.log(model.state.recipe); // Debugging line bookmarked = true
  }

  // removebookmark
  else {
    model.removeBookmark(model.state.recipe.id);
    alert(
      `${model.state.recipe.title} recipe has been removed from Bookmarked`
    );
    console.log(model.state.recipe); // Debugging line bookmarked = true
  }

  // update View
  recipeView.update(model.state.recipe); // This should update the UI to reflect the bookmark status

  // render
  bookmarkView.render(model.state.bookmarks);
  console.log(model.state.bookmarks); // Should show the current bookmarks
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // console.log(newRecipe);

    addRecipeView.renderSpinner();
    //upload recipe
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    // sucessful message
    addRecipeView.renderSuccess();

    // render bookmarks
    bookmarkView.render(model.state.bookmarks);

    // to change id in url

    window.history.pushState(null, '', `#${model.state.recipe.id}`); //=> to (state, 'title',url)
    //close Window
    setTimeout(function () {
      addRecipeView.renderSpinner();
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_TIME_OUT * 1000); //=>check config file for value

    console.log(model.state.recipe);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};
// Call the function to fetch and log the recipe
// controlRecipes();

// ['hashchange', 'load'].forEach(event =>
//   window.addEventListener(event, controlRecipes)
// ); => check in views

// Initialization function to set up event handlers
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlSearchPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

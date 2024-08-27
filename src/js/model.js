import { async } from 'regenerator-runtime';
import { API_URL, Pagination, API_KEY } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  bookmarks: [],
  search: {
    query: '',
    results: [],
    resultsPerPage: Pagination,
    page: 1,
  },
};

const createRecipeObject = function (data) {
  // let recipe = data.data.recipe;
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    ...(recipe.key && { key: recipe.key }),
    // key:recipe.key the above line code is ntg but this line of code
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    // console.log(state.recipe);
    state.recipe = createRecipeObject(data);

    const isBookmarked = state.bookmarks.some(
      bookmark => bookmark.id === state.recipe.id
    );

    if (isBookmarked) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (err) {
    // console.error(`${err} 💣💣💣💣💣`);
    throw err; // will be handled in controller
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // console.log(data);
    console.log('API Response:', data); // Log the API response

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
        // key:recipe.key the above line code is ntg but this line of code
      };
    });
    // Reset the current page to 1
    state.search.page = 1;
    // console.log(state.search.results);
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥💥💥`);
    throw err; // will be handled in controller
  }
};

// loadSearchResults('pizza');

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  // const start = (page - 1) * 10; // const start = 0;, it is multiplied by 10 bcz we want display 10 recipe details
  // const end = page * 10; // const end = 9;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(
    //newQt =oldQt * newServing / oldServing // 2*8/4 =4
    ing => {
      ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
    }
  );

  state.recipe.servings = newServing;
};

const persistBook = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); // => arg1=> just a name and arg2 => what we want to store then call this in bookmark functions
};

export const addBookmark = function (recipe) {
  // Adding recipe

  state.bookmarks.push(recipe);
  // }

  // Update the bookmarked state
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBook();
};

export const removeBookmark = function (id) {
  // finding the index to delete the recipe
  const index = state.bookmarks.findIndex(el => el.id === id);

  // remove it by using splice method from array
  state.bookmarks.splice(index, 1);

  // remove the bookmarked state
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBook();
};

// fetching the values from localStorage to bookmark
const init = function () {
  const storage = localStorage.getItem('bookmarks'); //=> for fetching and arg is name given above

  if (storage) state.bookmarks = JSON.parse(storage); // converting string to obj
};
init();
// console.log(state.bookmarks);

export const uploadRecipe = async function (
  newRecipe //=> check addrecipeView upload method for FYI
) {
  try {
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1] //=> we have used 1 bcz check above line
        //   .replaceAll(' ', '')
        //   .split(',');

        const ingArr = ing[1].split(',').map(el => el.trim());

        const [quantity, unit, description] = ingArr;
        if (ingArr.length !== 3) throw new Error('Wrong ingredients format'); //=> it is complusary that wehave use 3 ing
        return {
          quantity: quantity ? +quantity : null,
          unit: unit ? +unit : unit,
          description,
        };
      });
    // console.log(ingredients);
    // object that needs to be uploaded

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl, //string type
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime, //=>number type
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe); //=> it will send recipe and also awaited and check helper for sendJSON syntax
    console.log(data);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    // console.error(err);
    throw err; //=> can be handled in controller
  }
};

import { API_URL } from './config';
import { AJAX } from './help';
import { RESULTS_PERPAGE, KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PERPAGE,
  },
  bookmarks: [],
};
const createRecipe = data => {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const getRecipe = async id => {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipe(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(err, '🤖🤖🤖');
    throw err;
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.page = 1;
    state.search.results = data.data.recipes.map(recipe => ({
      id: recipe.id,
      image: recipe.image_url,
      publisher: recipe.publisher,
      title: recipe.title,
      ...(recipe.key && { key: recipe.key }),
    }));
  } catch (err) {
    console.error(err, '🤖🤖🤖');
    throw err;
  }
};
export const getResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const dataLength = state.search.results.length;
  const start = (page - 1) * state.search.resultsPerPage;
  const end =
    dataLength - start > state.search.resultsPerPage
      ? page * state.search.resultsPerPage
      : dataLength;
  return state.search.results.slice(start, end);
};
export const updateServing = newServings => {
  state.recipe.ingredients.forEach(item => {
    item.quantity = (newServings * item.quantity) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};
const parsistBookmark = () => {
  try {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  } catch (err) {
    console.error(err, '🤖🤖🤖');
    throw err;
  }
};

export const addBookmark = id => {
  state.bookmarks.push(state.recipe);

  //Mark current recipe bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = true;

  parsistBookmark();
};
export const deleteBookmark = id => {
  state.bookmarks = state.bookmarks.filter(item => item.id !== id);

  //Mark current recipe NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  parsistBookmark();
};

export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(item => {
        return item[1] !== '' && /^ingredient/.test(item[0]);
      })
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipe(data);
    addBookmark(state.recipe.id);
  } catch (err) {
    console.error(err, '🤖🤖🤖');
    throw err;
  }
  //Run err
};
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
clearBookmarks();
const init = () => {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

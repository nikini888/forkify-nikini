import 'regenerator-runtime/runtime';
import 'core-js/stable';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
// https://forkify-api.herokuapp.com/v2
/// ////////////////////////////////////

const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    // 1. Add data to state
    await model.getRecipe(id);

    // 2. Render recipe
    recipeView.render(model.state.recipe);
    resultsView.recipeOnRender(id);
  } catch (err) {
    console.log(err);

    recipeView.renderError();
  }
};
const controlSearch = async () => {
  try {
    // 1. Get query from input
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    // 2. Add data to state
    await model.loadSearchResults(query);

    resultsView.render(model.getResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError();
  }
};
const controlPagination = async goPage => {
  try {
    resultsView.render(model.getResultsPage(goPage));
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlBookmarkButton = () => {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe.id);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};
const controlUpdateServing = updateTo => {
  model.updateServing(updateTo);
  recipeView.update(model.state.recipe);
};
const controlBookmarkRender = () => {
  if (!model.state.bookmarks) return;
  bookmarkView.render(model.state.bookmarks);
};
const controlAddRecipe = async data => {
  try {
    addRecipeView.renderSpinner();
    //Upload new recipe
    await model.uploadRecipe(data);

    //Render new recipe
    recipeView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Success message
    addRecipeView.renderMessage();

    //Close form
    setTimeout(function () {
      addRecipeView.toggleDiv();
      location.reload();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err);
  }
};
const init = function () {
  addRecipeView.addHandleSubmitForm(controlAddRecipe);
  bookmarkView.addHandleRender(controlBookmarkRender);
  recipeView.addHandleRender(controlRecipe);
  recipeView.addHandleUpdateServing(controlUpdateServing);
  recipeView.addHandlClickBookmark(controlBookmarkButton);
  searchView.addHandleRender(controlSearch);
  paginationView.addHandleRender(controlPagination);
};
init();

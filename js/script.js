// nameSpace
const cocktailApp = {};
cocktailApp.urlSearchBar =
  "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=";

$("form").on("submit", (event) => {
  event.preventDefault();
  cocktailApp.clearPreviousSearchResult();
  cocktailApp.clearSearchError();
  cocktailApp.performSearch();
});

cocktailApp.performSearch = function () {
  const userSelectedIngredient = $("#userInput").val();
  $.ajax({
    url: `${cocktailApp.urlSearchBar}${userSelectedIngredient}`,
    method: "GET",
    dataType: "json",
  }).then((userChoiceResult) => {
    // create an empty array that will hold the drinks that will be display on the page
    const drinksToDisplay = [];
    const allDrinks = userChoiceResult.drinks;
    // select up to  4 drinks  to be display on the page
    for (let i = 0; i < allDrinks.length && i < 4; i++) {
    // populate empty array that will hold the drinks that will be display on the page
      drinksToDisplay.push(allDrinks[i]);
    }
    cocktailApp.displayDrinksGallery(drinksToDisplay);
  }, () => {
    cocktailApp.showNotFoundIngredient();
  });
};
cocktailApp.displayDrinksGallery = function (data) {
  // create an unorder list to hold the images
  cocktailApp.ulImgContainer = $("<ul>");
  // look through each object in the drinksToDisplay  array
  data.forEach(function (drink) {
    const galleryImgList = $("<li>");
    // recording drinkId in variable
    const drinkId = drink.idDrink;
    // creating html button
    const galleryImgButton = $(
      `<button type="button" data-drink-id="${drinkId}">`
    );
    const drinkImg = $("<img>").attr("src", drink.strDrinkThumb);
    drinkImg.attr(`'alt', ${drink.strDrink} cold drink`);
    const drinkName = $("<p>").text(drink.strDrink);
    // appending button inside list item to make image clickable
    const drinkContainer = galleryImgList.append(
      galleryImgButton.append(drinkImg, drinkName)
    );
    console.log(galleryImgButton);

    cocktailApp.ulImgContainer.append(drinkContainer);

    $(".galleryDrinksContainer").html(cocktailApp.ulImgContainer);
    // adding img on click handler (this needs to be called AFTER adding to screen or else .click method will not work)
    // $(`[data-drink-id="${drinkId}"]`).on("click", function () {
    //   console.log("YAYYY CLICKY");
    // }); JQUERY IS NOT WORKING FOR THIS : (

    document
      .querySelector(`[data-drink-id="${drinkId}"]`)
      .addEventListener("click", function () {
        getIngredients(drinkId);
      });
  });
};    

cocktailApp.showNotFoundIngredient = function() {
  const titleNotFound = $('<h2>').text('Not Found :(');
  const paragraphNotFound = $('<p>').text('Try a new ingredient: 🍋 🍎 🍇 🍊 🍸');
  const notFoundMessage = $('<div>').append(titleNotFound, paragraphNotFound);
  $('.notFoundMessageContainer').removeClass('nonDisplay');
  $('.notFoundMessageContainer').html(notFoundMessage);
};
cocktailApp.clearPreviousSearchResult = () => {
  $('.galleryDrinksContainer').html("");
};
cocktailApp.clearSearchError = () => {
  $('.notFoundMessageContainer').html("");
};

//make ajax call to end point using drinkID variable
function getIngredients(drinkId) {
  $.ajax({
    url: `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`,
    method: "GET",
    dataType: "json",
  })
    //Store selected drink from drinks array in an variable
    .then(function (result) {
      instruction = result.drinks[0].strInstructions;
      $(".ingredientsContainer").html(instruction);
    });
}

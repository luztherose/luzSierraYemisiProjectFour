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
  }).then(
    (userChoiceResult) => {
      // create an empty array that will hold the drinks that will be display on the page
      const drinksToDisplay = [];
      const allDrinks = userChoiceResult.drinks;
      // select up to  4 drinks  to be display on the page
      for (let i = 0; i < allDrinks.length && i < 4; i++) {
        // populate empty array that will hold the drinks that will be display on the page
        drinksToDisplay.push(allDrinks[i]);
      }
      cocktailApp.displayDrinksGallery(drinksToDisplay);
    },
    () => {
      cocktailApp.showNotFoundIngredient();
    }
  );
};
cocktailApp.displayDrinksGallery = function (data) {
  // create an unorder list to hold the images
  cocktailApp.ulImgContainer = $("<ul>");
  // look through each object in the drinksToDisplay  array
  data.forEach(function (drink) {
    const galleryImgList = $("<li>");
    const drinkId = drink.idDrink;
    const drinkImg = $("<img>").attr("src", drink.strDrinkThumb);
    drinkImg.attr(`'alt', ${drink.strDrink} cold drink`);
    const drinkName = $("<p>").text(drink.strDrink);
    // creating html button
    const galleryImgButton = $(
      `<button class="imageButton" type="button" data-drink-id="${drinkId}">`
    );
    // appending button inside list item to make image clickable
    const drinkContainer = galleryImgList.append(
      galleryImgButton.append(drinkImg, drinkName)
    );

    cocktailApp.ulImgContainer.append(drinkContainer);
    $(".galleryDrinksContainer").html(cocktailApp.ulImgContainer);
    // adding img on click handler (this needs to be called AFTER adding to screen or else .click method will not work)
    // $(`[data-drink-id="${drinkId}"]`).on("click", function () {
    //   console.log("YAYYY CLICKY");
    // }); JQUERY IS NOT WORKING FOR THIS : (
    document
      .querySelector(`[data-drink-id="${drinkId}"]`)
      .addEventListener("click", function () {
        // calling getIngredients function to display instructions to page
        getIngredients(drinkId);
      });
  });
};

cocktailApp.showNotFoundIngredient = function () {
  const titleNotFound = $("<h2>").text("Not Found :(");
  const paragraphNotFound = $("<p>").text(
    "Try a new ingredient: 🍋 🍎 🍇 🍊 🍸"
  );
  const notFoundMessage = $("<div>").append(titleNotFound, paragraphNotFound);
  $(".notFoundMessageContainer").removeClass("nonDisplay");
  $(".notFoundMessageContainer").html(notFoundMessage);
};
cocktailApp.clearPreviousSearchResult = () => {
  $(".galleryDrinksContainer").html("");
};
cocktailApp.clearSearchError = () => {
  $(".notFoundMessageContainer").html("");
};

//make ajax call to end point using drinkID variable
function getIngredients(drinkId) {
  $.ajax({
    url: `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`,
    method: "GET",
    dataType: "json",
  }).then(function (result) {
    const drink = result.drinks[0];
    const instructions = drink.strInstructions;
    // clear results before new ingredients display
    $(".ingredientsContainer").empty();
    // loop through numbers 1-15 and add ingredients to list
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];

      console.log(ingredient);

      // if that ingredient exists inside the drink
      if (ingredient != null) {
        // create an li everytime we need an ingredient
        const instructionsLi = $("<li>");
        instructionsLi.html(ingredient);
        // have results display to screen in li
        $(".ingredientsContainer").append(instructionsLi);
      }
    }

    // display instructions to page
    $(".instructionsContainer").html(instructions);
  });
}

cocktailApp.urlRandomButton =
  "https://www.thecocktaildb.com/api/json/v1/1/random.php";

const setRandomButton = function () {
  // make AJAX request
  $.ajax({
    url: cocktailApp.urlRandomButton,
    dataType: "json",
    method: "GET",
  }).then((results) => {
    $(".galleryDrinksContainer").empty();
    $(".ingredientsContainer").empty();
    // console.log(results);
    // store random drink instructions from array in an instructions variable
    const randomResults = results.drinks[0];
    const randomPictureContainer = randomResults.strDrinkThumb;
    const randomImage = $("<img>").attr("src", randomPictureContainer);
    console.log(randomImage);
    randomImage.attr("alt", "picture of cocktail");
    $(".galleryDrinksContainer").append(randomImage);
    const instructions = randomResults.strInstructions;
    const instructionsContainer = $("<p>").text(instructions);
    $(".galleryDrinksContainer").append(instructionsContainer);
  });
};

// get user input
// listen for click event to generate random drink
$("button").on("click", function () {
  setRandomButton();
});

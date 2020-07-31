// nameSpace
const cocktailApp = {};
cocktailApp.urlSearchBar = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';

$('form').on('submit', (event) => {
    event.preventDefault();
    // store what user type in a variable
    cocktailApp.userChoice = $('#userInput').val();
    //Calling the making the ajax request function
    cocktailApp.setSearchBar(cocktailApp.userChoice);
    //console.log(cocktailApp.userChoice);
    // clean input
    setTimeout(() => {
        $('#userInput').val('');
    }, 1000);
});
// make an ajax request base in the user input 
cocktailApp.setSearchBar = function (userSelectedIngridient) {
    $.ajax({
        url: `${cocktailApp.urlSearchBar}${userSelectedIngridient}`,
        method: 'GET',
        dataType: 'json',
    }).then((userChoiceResult) => {
        // create an empty array that will hold the drinks that will be display on the page
        const drinksToDisplay = [];
        const allDrinks = userChoiceResult.drinks;
        // select up to  6 drinks  to be display on the page
        for (let i = 0; i < allDrinks.length && i < 4; i++) {
            // populate empty array that will hold the drinks that will be display on the page
            drinksToDisplay.push(allDrinks[i]);
        }
        cocktailApp.displayDrinksGalley(drinksToDisplay);
    });
}
cocktailApp.displayDrinksGalley = function (data) {
    // create an unorder list to hold the images
    cocktailApp.ulImgContainer = $('<ul>');
    // look through each object in the drinksToDisplay  array
    data.forEach(function (drink) {
        const galleryImgList = $('<li>');
        const drinkImg = $('<img>').attr('src', drink.strDrinkThumb);
        drinkImg.attr(`'alt', ${drink.strDrink} cold drink`);
        const drinkName = $('<p>').text(drink.strDrink);
        const drinkContainer = galleryImgList.append(drinkImg, drinkName);
        cocktailApp.ulImgContainer.append(drinkContainer);
        $('.galleryDrinksContainer').html(cocktailApp.ulImgContainer);
    });
}





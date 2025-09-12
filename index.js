let searchBtn = document.querySelector('.searchBtn');
let searchBox = document.querySelector('.searchBox');
let recipesSection = document.querySelector('.recipes-container');
let recipeDetailsContent = document.querySelector('.recipe-details-content');
let recipeCloseBtn = document.querySelector('.recipe-close-btn');

// function to fetch recipes using .then()
function fetchRecipes(query) {
    recipesSection.innerHTML = "<h2>Fetching recipes...</h2>";
   
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                recipesSection.innerHTML = "";

                if (!data.meals) {
                    recipesSection.innerHTML = "<h2>No recipes found</h2>";
                   
                    return;
                }

                data.meals.forEach(meal => {
                    const recipesDiv = document.createElement('div');
                    recipesDiv.classList.add('recipe');
                    recipesDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <p>${meal.strArea} <span>Dish</span></p>
                    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                `;

                    const button = document.createElement('button');
                    button.textContent = "View Recipe";
                    recipesDiv.appendChild(button);

                    button.addEventListener('click', () => {
                        openRecipePopup(meal);
                    });

                    recipesSection.appendChild(recipesDiv);
                });
            })
    
        .catch(error => {
            recipesSection.innerHTML = `${error}</h4>`;
           errorMessage(error);
        });
}

// function to show recipe details
const fetchIngredients = (meal) => {
    let ingredientList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} - ${ingredient}</li>`;
        }
        else {
            break;
        }
    }
    return ingredientList;
}
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p class="instructions">${meal.strInstructions}</p>
        </div>
    `;
    recipeDetailsContent.parentElement.style.display = 'block';
}

// const closeRecipePopup = () => {
//     recipeDetailsContent.textContent = `
//     <h2>${meal.strMeal}</h2>
//     `;
//     recipeDetailsContent.parentElement.style.display = 'none';
// }
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = 'none';
});
// event listener for search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
       recipesSection.innerHTML = `<h5>Please type the meal in the search box</h5>`;
        return;
    }
        fetchRecipes(searchInput);
    });

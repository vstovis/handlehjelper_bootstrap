// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

const categories = {
    fish: {
        icon: "fa-fish",
        nameNo: "fisk"
    },
    meat: {
        icon: "fa-drumstick-bite",
        nameNo: "kjøtt"
    },
    vegetarian: {
        icon: "fa-carrot",
        nameNo: "vegetar"
    },
}

// TODO: finn en sikrere løsning for autentisering
const firebaseConfig = {
    apiKey: "AIzaSyB1yIBlddLGUEuJL8zC6SO_76caW1QvAGk",
    authDomain: "stovis-test.firebaseapp.com",
    databaseURL: "https://stovis-test.firebaseio.com",
    projectId: "stovis-test",
    storageBucket: "stovis-test.appspot.com",
    messagingSenderId: "870509678363",
    appId: "1:870509678363:web:9259e68f8d0db8070a0dbe",
    measurementId: "G-BCKGEHPYVJ"
};  

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    
    
    const recipeList = document.getElementById("recipe-list");
    const title = document.getElementById("recipe-panel-title");
    const category = document.getElementById("body-category");
    const ingredients = document.getElementById("body-ingredients");
    const source = document.getElementById("body-source");
    
    const recipePopulator = (recipes) => {
        while (recipeList.hasChildNodes()) {
            recipeList.removeChild(recipeList.firstChild);
        }
        recipes.forEach((recipesnapshot) => {
            const recipe = recipesnapshot.data();
            const onRecipeClick = () => {
                title.innerText = recipe.name
                const categoryType = categories[recipe.category]
                if (categoryType) {
                    category.innerText = `Kategori: ${categoryType.nameNo}`
                } else {
                    category.innerText = `Fiks denne: ${recipe.category}, ${recipesnapshot.id}`
                }
                ingredients.innerText = `Ingredienser: ${recipe.ingredients}`
                source.innerText = `Kilde: ${recipe.source}`                
            }

            const aElem = document.createElement("a");
            // aElem.innerHTML = recipe.name;
            aElem.classList.add("list-group-item", "list-group-item-action", "row");
            aElem.addEventListener("click", onRecipeClick);
            
            if (categories[recipe.category]) {
                const iconElem = document.createElement("i");
                iconElem.classList.add("col-1", "fas", categories[recipe.category].icon);
                aElem.appendChild(iconElem);
            }
            const nameElem = document.createElement("span");
            // nameElem.classList.add("col-8");
            nameElem.innerHTML=recipe.name;
            aElem.appendChild(nameElem);

            recipeList.appendChild(aElem);
        });
    };

    const orderSelector = document.getElementById("order-selector");
    orderSelector.addEventListener("change", (event) => {
        db.collection("recipes").orderBy(event.srcElement.value).get().then(recipePopulator);
    })

    db.collection("recipes").orderBy("category").get().then(recipePopulator); 
});

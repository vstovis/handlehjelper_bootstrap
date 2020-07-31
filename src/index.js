// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

const recipeList = document.getElementById("recipe-list");
const title = document.getElementById("recipe-panel-title");
const category = document.getElementById("body-category");
const ingredients = document.getElementById("body-ingredients");
const source = document.getElementById("body-source");
const inputName = document.getElementById("input-recipe-name");
const inputSource = document.getElementById("input-recipe-source");
const inputIngredients = document.getElementById("input-recipe-ingredients")
const categorySelector = document.getElementById("input-recipe-category");
const orderSelector = document.getElementById("order-selector");
const buttonSubmit = document.getElementById("button-submit");

const categories = {
    fish: {
        icon: "fa-fish",
        nameNo: "Sjømat", 
        color: "#76b5c8"
    },
    meat: {
        icon: "fa-drumstick-bite",
        nameNo: "Kjøttrett",
        color: "#ca3c3c"
    },
    vegetarian: {
        icon: "fa-leaf",
        nameNo: "Vegetarrett",
        color: "#7ec45f"
    },
    misc: {
        icon: "fa-utensils",
        nameNo: "Diverserett",
        color: "#bfbfbf"
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

function onContentLoaded() {
    
    for (const category in categories) {
        const optionElem = document.createElement("option");
        optionElem.innerText = categories[category].nameNo;
        optionElem.setAttribute("value", category);
        categorySelector.appendChild(optionElem);
    }
    
    buttonSubmit.addEventListener("click", onClickSubmit);

    orderSelector.addEventListener("change", (event) => {
        db.collection("recipes").orderBy(event.srcElement.value).get().then(recipePopulator);
    });
    
    db.collection("recipes").orderBy("category").get().then(recipePopulator); 
    
}

function onClickSubmit() {
    db.collection("recipes").add({
        category: categorySelector.value,
        ingredients: inputIngredients.value.split(/\n/),
        name: inputName.value,
        source: inputSource.value
    })
    .then((docRef) => {
        console.log("Oppskrift lagt til med følgende id:" + docRef.id);
        db.collection("recipes").orderBy("category").get().then(recipePopulator);
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}

function recipePopulator(recipes) {
    
    while (recipeList.hasChildNodes()) {
        recipeList.removeChild(recipeList.firstChild);
    }

    recipes.forEach(recipesnapshot => {
        const recipe = recipesnapshot.data();
        const onRecipeClick = () => {
            title.innerText = recipe.name
            const categoryType = categories[recipe.category]
            if (categoryType) {
                category.innerText = categoryType.nameNo
            } else {
                category.innerText = `Fiks denne: ${recipe.category}, ${recipesnapshot.id}`
            }
            while (ingredients.hasChildNodes()) {
                ingredients.removeChild(ingredients.firstChild);
            }
            for (const ingredient of recipe.ingredients) {
                const liElem = document.createElement("li");
                liElem.innerText = ingredient;
                liElem.classList.add("list-group-item");
                ingredients.appendChild(liElem);
            }
            source.innerText = `Kilde: ${recipe.source}`                
        }

        const aElem = document.createElement("a");
        // aElem.innerHTML = recipe.name;
        aElem.classList.add("list-group-item", "list-group-item-action", "row");
        aElem.addEventListener("click", onRecipeClick);
        
        if (categories[recipe.category]) {
            const iconElem = document.createElement("i");
            iconElem.classList.add("col-2", "fas", categories[recipe.category].icon);
            iconElem.setAttribute("style", "color:" + categories[recipe.category].color);
            aElem.appendChild(iconElem);
        }
        const nameElem = document.createElement("span");
        // nameElem.classList.add("col-8");
        nameElem.innerHTML=recipe.name;
        aElem.appendChild(nameElem);

        recipeList.appendChild(aElem);
    });       
}

document.addEventListener('DOMContentLoaded', onContentLoaded);
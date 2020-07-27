// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

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
        recipes.forEach((recipesnapshot) => {
            const recipe = recipesnapshot.data();
            const onRecipeClick = () => {
                title.innerText = recipe.name
                category.innerText = `Kategori: ${recipe.category}`
                ingredients.innerText = `Ingredienser: ${recipe.ingredients}`
                source.innerText = `Kilde: ${recipe.source}`
                console.log(recipe)
                
            }

            const aElem = document.createElement("a");
            aElem.innerHTML = recipe.name;
            aElem.classList.add("list-group-item", "list-group-item-action")
            aElem.onclick = onRecipeClick
            recipeList.appendChild(aElem);
        });
    };

    db.collection("recipes").get().then(recipePopulator); 
});

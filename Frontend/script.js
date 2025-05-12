//Catagory tiles
const specialsTile = document.getElementById("specials");
const appetizersTile = document.getElementById("appetizers");
const mainsTile = document.getElementById("mains");
const burgersTile = document.getElementById("burgers");
const pizzasTile = document.getElementById("pizzas");
const drinksTile = document.getElementById("drinks");
const dessertsTile = document.getElementById("desserts");
const otherTile = document.getElementById("other");

console.log(specialsTile);

//Catagory tiles event listeners
specialsTile.addEventListener("click", function() {
    window.location.href = "specials/index.html";
});
appetizersTile.addEventListener("click", function() {
    window.location.href = "appetizers/index.html";
});
mainsTile.addEventListener("click", function() {
    window.location.href = "mains/index.html";
});
burgersTile.addEventListener("click", function() {
    window.location.href = "burgers/index.html";
});
pizzasTile.addEventListener("click", function() {
    window.location.href = "pizzas/index.html";
});
drinksTile.addEventListener("click", function() {
    window.location.href = "drinks/index.html";
});
dessertsTile.addEventListener("click", function() {
    window.location.href = "desserts/index.html";
});
otherTile.addEventListener("click", function() {
    window.location.href = "other/index.html";
});


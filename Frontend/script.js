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
    window.location.href = "specials.html";
});
appetizersTile.addEventListener("click", function() {
    window.location.href = "appetizers.html";
});
mainsTile.addEventListener("click", function() {
    window.location.href = "mains.html";
});
burgersTile.addEventListener("click", function() {
    window.location.href = "burgers.html";
});
pizzasTile.addEventListener("click", function() {
    window.location.href = "pizzas.html";
});
drinksTile.addEventListener("click", function() {
    window.location.href = "drinks.html";
});
dessertsTile.addEventListener("click", function() {
    window.location.href = "desserts.html";
});
otherTile.addEventListener("click", function() {
    window.location.href = "other.html";
});

function addRes() {
    document.getElementById("addReservationForm").style = "display: flex; height: auto"
}


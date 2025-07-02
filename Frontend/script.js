//Catagory tiles
const specialsTile = document.getElementById("specials");
const appetizersTile = document.getElementById("appetizers");
const mainsTile = document.getElementById("mains");
const burgersTile = document.getElementById("burgers");
const pizzasTile = document.getElementById("pizzas");
const drinksTile = document.getElementById("drinks");
const dessertsTile = document.getElementById("dessert");
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

function addResDrop() {
    if (document.getElementById("addReservationForm").style.display === "flex") {
        document.getElementById("addReservationForm").style = "display: none; height: 0px"
    }
    else {
        document.getElementById("addReservationForm").style = "display: flex; height: auto"
    }
}

function submitRes() {
    const name = document.getElementById("resName").value;
    const email = document.getElementById("resEmail").value;
    const date = document.getElementById("resDate").value;
    const time = document.getElementById("resTime").value;
    const guests = document.getElementById("resGuests").value;
    
    console.log("Submitting reservation:", { name, email, date, time, guests });

    if (!name || !email || !date || !time || !guests) {
        alert("Please fill in all fields.");
        return;
    }

    // Here you would typically send the reservation data to the server
    console.log("Reservation submitted:", { name, email, date, time, guests });
    fetch('http://localhost:3000/reserve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            date: date,
            time: time,
            guests: guests
        })
        .then(response => response.json())
        .then(data => {
            if (data.available && data.ok) {
                alert("Reservation successfully submitted!");
            } else if (!data.available && data.ok) {
                alert("No suitable tables available");
        } else {
            alert("Failed to submit reservation. Please try again.");
        }
    }).catch(error => {
        console.error("Error submitting reservation:", error);
        alert("An error occurred while submitting your reservation. Please try again later.");
    })
    });

    // Reset form and hide it
    document.getElementById("addReservationForm").reset();
    addResDrop();
}
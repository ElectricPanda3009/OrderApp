const itemList = document.getElementById("item-list");
const addItemForm = document.getElementById("add-item-form");
const addItemButton = document.getElementById("add-item-button");

addItemButton.addEventListener("click", () => {
    addItemForm.style.display = addItemForm.style.display === "none" ? "block" : "none";
});

function loadItems() {
    itemList.innerHTML = ""; // Clear the list before loading items
    fetch('http://localhost:3000/items', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(items => {
            items.forEach(item => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <span>${item.name}</span>
                    <button class="delete-item" onclick="deleteItem(${item.id})">Delete</button>
                `;
                itemList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("Error loading items:", error);
            alert("Failed to load items. Please try again later.");
        });
}
// Load initial items from the server
loadItems();

addItemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("item-name").value;
    const price = document.getElementById("item-price").value;
    const description = document.getElementById("item-description").value;
    const category = document.getElementById("item-category").value;
    const itemData = {
        name: name,
        price: Number(price),
        description: description,
        category: category
    };

    fetch('http://localhost:3000/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    })
        .then(response => response.json())
        .then(() => {
            loadItems(); // Reload items after adding a new one
            addItemForm.reset(); // Reset the form
            addItemForm.style.display = "none"; // Hide the form after submission
        })
        .catch(error => {
            console.error("Error adding item:", error);
            alert("Failed to add item. Please try again later.");
        });
});

function deleteItem(itemId) {
    if (!confirm("Are you sure you want to delete this item?")) {
        return; // User cancelled the deletion
    }

    fetch(`http://localhost:3000/delete?id=${itemId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete item");
            }
            loadItems(); // Reload items after deletion
        })
        .catch(error => {
            console.error("Error deleting item:", error);
            alert("Failed to delete item. Please try again later.");
        });
}

function loadReservations() {
    fetch('http://localhost:3000/reservations', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(reservations => {
            console.log(reservations);
            const reservationList = document.getElementById("reservation-list");
            reservationList.innerHTML = ""; // Clear previous reservations
            reservations.forEach(reservation => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <span>${reservation.customer_name} - ${reservation.reservation_date.substring(0, 10)} at ${reservation.reservation_time} - ${reservation.customer_email}</span>
                    <button class="delete-reservation" onclick="deleteReservation(${reservation.id})">Delete</button>
                `;
                reservationList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("Error loading reservations:", error);
            alert("Failed to load reservations. Please try again later.");
        });
}

loadReservations();

function deleteReservation(reservationId) {
    if (!confirm("Are you sure you want to delete this reservation?")) {
        return; // User cancelled the deletion
    }

    fetch(`http://localhost:3000/deleteReservation?id=${reservationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete reservation");
            }
            loadReservations(); // Reload reservations after deletion
        })
        .catch(error => {
            console.error("Error deleting reservation:", error);
            alert("Failed to delete reservation. Please try again later.");
        });
}

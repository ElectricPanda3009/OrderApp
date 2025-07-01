const itemList = document.getElementById("item-list");
const addItemForm = document.getElementById("add-item-form");
const addItemButton = document.getElementById("add-item-button");

addItemButton.addEventListener("click", () => {
    addItemForm.style.display = addItemForm.style.display === "none" ? "block" : "none";
});
itemList.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-item")) {
        const item = event.target.parentElement;
        const itemName = item.querySelector("span").textContent;
        const newName = prompt("Edit item name:", itemName);
        if (newName) {
            item.querySelector("span").textContent = newName;
        }
    } else if (event.target.classList.contains("delete-item")) {
        const item = event.target.parentElement;
        itemList.removeChild(item);
    }
});
// Load initial items from the server
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
                <button class="edit-item">Edit</button>
                <button class="delete-item">Delete</button>
            `;
            itemList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("Error loading items:", error);
        alert("Failed to load items. Please try again later.");
    }
);
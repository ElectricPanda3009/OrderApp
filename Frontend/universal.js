let items = [];
let cart = localStorage.getItem("cart");
let cartTotal = 0;
category = window.location.pathname.split('/').pop().replace('.html', ''); // Get category from URL

document.addEventListener('DOMContentLoaded', () => {
    loadItems();
});

function loadItems() {
    fetch(`http://localhost:3000/menu?category=${category}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            items = data;
            displayItems();
        })
        .catch(error => console.error('Error loading items:', error));
}

function displayItems() {
    const itemsContainer = document.getElementById('menu');
    itemsContainer.innerHTML = ''; // Clear previous items
    console.log('Items:', items);

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.id = item.id;
        let itemImage = 'images/default-image.jpg'; // Fallback image
        itemDiv.innerHTML = `
            <div class="details">
                <h2>${item.name}</h2>
                <p>${item.description}</p>
                <p>Price: ${item.price}</p>
                <button class="addBtn" onclick="addToCart(${item.id})">Add to order</button>
            </div>
            <img src="${itemImage}">
        `;

        
        itemsContainer.appendChild(itemDiv);
    });

    updateCart();
}

function addToCart(id) {
    items.forEach(item => {
        if (item.id == id) {
            cart.push(item)
        }
    })

    console.log(cart)

    updateCart();
}

function updateCart() {
    var cartIcon = document.getElementById("cart");

    cartTotal = 0;
    cart.forEach(item => {
        cartTotal += Number(item.price);
    });

    cartTotal = cartTotal.toFixed(2)

    console.log(cartTotal);

    cartIcon.innerText = `Cart: $${cartTotal}`

    localStorage.setItem("cart", cart)
}


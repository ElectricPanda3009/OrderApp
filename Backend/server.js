const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'orderApp'
};

const connection = mysql.createConnection(dbConfig);
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
}
);

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

app.get('/menu', (req, res) => {
  
  const category = req.query.category;

  const menu = getMenu(category)
  .then((items) => {
    res.status(200).json(items);
  })
  .catch((err) => {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Failed to fetch menu' });
  });

});

app.post('/order', (req, res) => {
  const order = req.body;

  if (!order || !order.items || order.items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  placeOrder(order)
    .then(() => {
      res.status(201).json({ message: 'Order placed successfully' });
    })
    .catch((err) => {
      console.error('Error placing order:', err);
      res.status(500).json({ error: 'Failed to place order' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function getMenu(category) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM menu WHERE category = ?', [category], (err, results) => {
      if (err) {
        console.error('Error fetching menu:', err);
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

function placeOrder(order) {
  return new Promise((resolve, reject) => {
    const { items, customerName, customerEmail, shippingAddress } = order;

    if (!items || items.length === 0) {
      reject(new Error('Invalid order data'));
      return;
    }

    const orderQuery = 'INSERT INTO orders (customer_name, customer_email, shipping_address) VALUES (?, ?, ?)';
    connection.query(orderQuery, [customerName, customerEmail, shippingAddress], (err, result) => {
      if (err) {
        console.error('Error placing order:', err);
        reject(err);
        return;
      }

      const orderId = result.id;
      
      const orderItems = items.map(item => [orderId, item.id, item.quantity, item.price]);
      const orderItemsQuery = 'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES ?';
      connection.query(orderItemsQuery, [orderItems], (err) => {
        if (err) {
          console.error('Error inserting order items:', err);
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}
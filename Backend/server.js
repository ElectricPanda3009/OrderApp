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

app.get('/items', (req, res) => {
  let items = [];
  const query = 'SELECT * FROM menu';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching items:', err);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }
    items = results;
    res.status(200).json(items);
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

app.post('/reserve', (req, res) => {
  const reservation = req.body;

  console.log('Received reservation:', reservation);

  if (!reservation || !reservation.name || !reservation.email || !reservation.date || !reservation.time || !reservation.guests) {
    return res.status(400).json({ error: 'Invalid reservation data' });
  }

  addReservation(reservation)
    .then((response) => {
      console.log('Reservation added successfully:', response.ok, response.table);
      if (!response.table) {
        return res.status(400).json({ available: false, ok: response.ok, message: 'No suitable tables available' });
      }
      res.status(201).json({ available: true, ok: response.ok, table: response.table, message: 'Reservation added successfully' });
    })
    .catch((err) => {
      console.error('Error reserving table:', err);
      res.status(500).json({ error: 'Failed to reserve table' });
    });
});

app.post('/add', (req, res) => {
  const item = req.body;

  console.log(item)

  if (!item || !item.name || !item.description || !item.price) {
    return res.status(400).json({ error: 'Invalid item data' });
  }


  const query = 'INSERT INTO menu (name, description, price, category) VALUES (?, ?, ?, ?)';
  connection.query(query, [item.name, item.description, item.price, item.category], (err, result) => {
    if (err) {
      console.error('Error adding item:', err);
      return res.status(500).json({ error: 'Failed to add item' });
    }
    res.status(201).json({ message: 'Item added successfully', itemId: result.insertId });
  });
});

app.get('/delete', (req, res) => {
  const itemId = req.query.id;
  if (!itemId) {
    return res.status(400).json({ error: 'Invalid item ID' });
  }
  const query = 'DELETE FROM menu WHERE id = ?';
  connection.query(query, [itemId], (err, result) => {
    if (err) {
      console.error('Error deleting item:', err);
      return res.status(500).json({ error: 'Failed to delete item' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  });
});

app.get('/reservations', (req, res) => {
  const query = 'SELECT * FROM reservations';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reservations:', err);
      return res.status(500).json({ error: 'Failed to fetch reservations' });
    }
    res.status(200).json(results);
  });
});

app.get('/deleteReservation', (req, res) => {
  const reservationId = req.query.id;
  if (!reservationId) {
    return res.status(400).json({ error: 'Invalid reservation ID' });
  }
  const query = 'DELETE FROM reservations WHERE id = ?';
  connection.query(query, [reservationId], (err, result) => {
    if (err) {
      console.error('Error deleting reservation:', err);
      return res.status(500).json({ error: 'Failed to delete reservation' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(200).json({ message: 'Reservation deleted successfully', ok: true });
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

function addReservation(Reservation) {
  return new Promise((resolve, reject) => {
    const { name, email, date, time, guests } = Reservation;

    findAvailableTable(date, time, guests)
      .then((response) => {
        if (!response.available) {
          reject(new Error('No suitable tables available'));
          return;
        }
        else {
          console.log('Available table:', response.table);
          resolve(insertReservation(response.table, name, email, date, time, guests));
        }
      })
      .catch((err) => {
    console.error('Error adding reservation:', err);
    reject(err);
    });
  });
}

function findAvailableTable(date, time, guests) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT table_number FROM table_availability WHERE seats >= ? AND table_number NOT IN (SELECT table_number FROM reservations WHERE reservation_date = ? AND reservation_time = ?)';
    connection.query(query, [guests, date, time], (err, results) => {
      if (err) {
        console.error('Error finding available table:', err);
        reject(err);
        return;
      }
      if (results.length > 0) {
        console.log('Available table found:', results[0].table_number);
        resolve({ available: true, table: results[0].table_number });
      } else {
        resolve({ available: false, table: null });
      }
    });
  });
}

function insertReservation(table, name, email, date, time, guests) {
  console.log('Inserting reservation for table:', table);
  return new Promise((resolve, reject) => {
    const reservationQuery = 'INSERT INTO reservations (table_number, customer_name, customer_email, reservation_date, reservation_time, party_size) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(reservationQuery, [table, name, email, date, time, guests], (err) => {
      if (err) {
        console.error('Error adding reservation:', err);
        reject(err);
        return;
      }
      resolve({ ok: true, table: table, message: 'Reservation added successfully'});
    });
  });
}


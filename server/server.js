const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Sample Data - Same as your completed project
let menuItems = [
  { id: 1, name: "Pizza", price: 299, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
  { id: 2, name: "Burger", price: 199, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
  { id: 3, name: "Pasta", price: 249, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9" },
  { id: 4, name: "Salad", price: 149, image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" }
];

let orders = [];
let reservations = [];
let users = [];

// Test Route
app.get('/', (req, res) => {
  res.send('Lavanya Restaurant Server Running...');
});

// Get Menu
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// Add Menu Item - Admin
app.post('/api/menu', (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  menuItems.push(newItem);
  res.json({ message: "Item Added", item: newItem });
});

// Delete Menu Item - Admin
app.delete('/api/menu/:id', (req, res) => {
  const id = parseInt(req.params.id);
  menuItems = menuItems.filter(item => item.id !== id);
  res.json({ message: "Item Deleted" });
});

// Place Order
app.post('/api/orders', (req, res) => {
  const order = { id: Date.now(), ...req.body, status: "Preparing", date: new Date() };
  orders.push(order);
  res.json({ message: "Order Placed Successfully", order });
});

// Get Orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Table Reservation
app.post('/api/reservations', (req, res) => {
  const reservation = { id: Date.now(), ...req.body, status: "Confirmed" };
  reservations.push(reservation);
  res.json({ message: "Table Reserved Successfully", reservation });
});

app.get('/api/reservations', (req, res) => {
  res.json(reservations);
});

// User Registration
app.post('/api/register', (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.json({ message: "Registration Successful", user });
});

// User Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ message: "Login Successful", user });
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET","POST","DELETE"],
  credentials: true
}));
app.use(express.json());

let menuItems = [
  { id: 1, name: "Margherita Pizza", price: 299, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
  { id: 2, name: "Veg Burger", price: 199, image: "https://images.unsplash.com/photo-1568909344668-6f14a07b56a0" },
  { id: 3, name: "Pasta Alfredo", price: 249, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9" },
  { id: 4, name: "French Fries", price: 99, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877" },
  { id: 5, name: "Biryani", price: 349, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8" },
  { id: 6, name: "Chocolate Cake", price: 149, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587" }
];
let reservations = [];
let orders = [];
let enquiries = [];

app.get('/api/menu', (req, res) => res.json(menuItems));
app.post('/api/menu', (req, res) => {
  const newItem = { id: Date.now(), ...req.body, price: Number(req.body.price) };
  menuItems.push(newItem);
  res.json({ message: "Item added", item: newItem });
});
app.delete('/api/menu/:id', (req, res) => {
  menuItems = menuItems.filter(i => i.id != req.params.id);
  res.json({ message: "Deleted" });
});

app.post('/api/reserve', (req, res) => {
  const newReserve = { id: Date.now(), ...req.body, status: "Confirmed", createdAt: new Date().toLocaleString() };
  reservations.push(newReserve);
  res.json({ message: "Table Reserved Successfully!" });
});
app.get('/api/reservations', (req, res) => res.json(reservations));
app.delete('/api/reservations/:id', (req,res)=>{
  reservations = reservations.filter(r=> r.id != req.params.id);
  res.json({message:"Reservation Deleted"});
});

app.post('/api/orders', (req, res) => {
  const newOrder = { id: Date.now(), ...req.body, status: "Placed", createdAt: new Date().toLocaleString() };
  orders.push(newOrder);
  res.json({ message: "Order Placed!", order: newOrder });
});
app.get('/api/orders', (req, res) => res.json(orders));
app.delete('/api/orders/:id', (req,res)=>{
  orders = orders.filter(o=> o.id != req.params.id);
  res.json({message:"Order Deleted"});
});

app.post('/api/enquiry', (req, res) => {
  const newEnquiry = { id: Date.now(), ...req.body, createdAt: new Date().toLocaleString() };
  enquiries.push(newEnquiry);
  res.json({ message: "Message Sent!" });
});
app.get('/api/enquiries', (req, res) => res.json(enquiries));
app.delete('/api/enquiries/:id', (req,res)=>{
  enquiries = enquiries.filter(e=> e.id != req.params.id);
  res.json({message:"Enquiry Deleted"});
});

app.get('/', (req,res)=> res.send("Backend Running - Lavanya Kitchen API - 8 Bonus Features"));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Collections: menu=${menuItems.length}, reservations=${reservations.length}, orders=${orders.length}, enquiries=${enquiries.length}`);
});

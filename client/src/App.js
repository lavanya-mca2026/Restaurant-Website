import "./App.css";
import { useState } from "react";
import ManageMenu from "./ManageMenu";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const foods = [
    {
      name: "Pizza",
      price: 299,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591"
    },
    {
      name: "Burger",
      price: 199,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
    },
    {
      name: "Pasta",
      price: 249,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9"
    },
    {
      name: "Salad",
      price: 149,
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
    }
  ];

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (food) => {
    setCart([...cart, food]);
  };

  // COMMIT 18 - New Feature Added
  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">🍽 Lavanya's Restaurant</h2>
        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Menu</li>
          <li>Contact</li>
        </ul>
        <h3>🛒 Cart ({cart.length})</h3>
        <button className="btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </nav>

      {/* Hero Section */}
      <div className="container">
        <h1>Delicious Food, Happy Moments!</h1>
        <p>
          Experience the best food in town with fresh ingredients,
          fast delivery, and unforgettable taste.
        </p>
        <button className="btn">Explore Menu</button>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search Food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Menu Section */}
      <div className="menu">
        <h2>Our Special Menu</h2>
        <div className="menu-items">
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food, index) => (
              <div className="card" key={index}>
                <img src={food.image} alt={food.name} />
                <h3>{food.name}</h3>
                <p>₹{food.price}</p>
                <button className="btn" onClick={() => addToCart(food)}>
                  Order Now
                </button>
              </div>
            ))
          ) : (
            <h3>No Food Found</h3>
          )}
        </div>
      </div>

      {/* Shopping Cart - UPDATED IN COMMIT 18 */}
      <div className="cart-section">
        <h2>🛒 Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <p>{item.name} - ₹{item.price}</p>
                <button className="btn" onClick={() => removeFromCart(index)}>
                  Remove
                </button>
              </div>
            ))}
            <h3 style={{marginTop:'15px', color:'#D4AF37'}}>Total Amount: ₹{cartTotal}</h3>
          </>
        )}
      </div>

      {/*Customer Reviews Section */}
      <section className="reviews">
        <h2>Customer Reviews</h2>
        <div className="review-container">
          <div className="review-card">
            <h3>⭐⭐⭐⭐⭐</h3>
            <p>"Best Biryani in town!"</p>
            <h4>- Sravan </h4>
          </div>
          <div className="review-card">
            <h3>⭐⭐⭐⭐⭐</h3>
            <p>"Fast delivery and delicious food."</p>
            <h4>- Lavanya</h4>
          </div>
          <div className="review-card">
            <h3>⭐⭐⭐⭐</h3>
            <p>"Great ambience and friendly staff."</p>
            <h4>- Ganesh</h4>
          </div>
        </div>
      </section>

      {/* About Section */}
      <div className="about">
        <h2>About Us</h2>
        <p>
          Welcome to Lavanya's Restaurant! We serve delicious and fresh food
          prepared with high-quality ingredients. Our mission is to provide
          tasty meals, excellent service, and unforgettable dining experiences.
        </p>
      </div>

      <div className="chef">
        <h2>Our Master Chef</h2>
        <img
          src="https://images.unsplash.com/photo-1583394293214-28ded15ee548"
          alt="Chef"
        />
        <p>
          Our experienced chef prepares every dish with fresh ingredients,
          passion, and authentic flavors to give you the best dining experience.
        </p>
      </div>

      {/* Timings Section */}
      <div className="timings">
        <h2>Restaurant Timings</h2>
        <p>Monday - Friday</p>
        <p>9:00 AM - 10:00 PM</p>
        <p>Saturday</p>
        <p>10:00 AM - 11:00 PM</p>
        <p>Sunday</p>
        <p>10:00 AM - 9:00 PM</p>
      </div>

      {/* Table Reservation Section */}
      <div className="reservation">
        <h2>Table Reservation</h2>
        <form className="reservation-form">
          <input type="text" placeholder="Enter Your Name" />
          <input type="email" placeholder="Enter Your Email" />
          <input type="tel" placeholder="Enter Your Phone Number" />
          <input type="number" placeholder="Number of Guests" />
          <input type="date" />
          <input type="time" />
          <button type="submit" className="btn">
            Reserve Table
          </button>
        </form>
      </div>

      {/* Online Food Ordering */}
      <div className="online-order">
        <h2>Online Food Ordering</h2>
        <div className="order-card">
          <h3>🍕 Pizza</h3>
          <p>Price: ₹299</p>
          <input type="number" placeholder="Quantity" />
          <button className="btn">Order Now</button>
        </div>
        <div className="order-card">
          <h3>🍔 Burger</h3>
          <p>Price: ₹199</p>
          <input type="number" placeholder="Quantity" />
          <button className="btn">Order Now</button>
        </div>
        <div className="order-card">
          <h3>🍝 Pasta</h3>
          <p>Price: ₹249</p>
          <input type="number" placeholder="Quantity" />
          <button className="btn">Order Now</button>
        </div>
        <div className="order-card">
          <h3>🥗 Salad</h3>
          <p>Price: ₹149</p>
          <input type="number" placeholder="Quantity" />
          <button className="btn">Order Now</button>
        </div>
      </div>

      {/* Order History */}
      <div className="order-history">
        <h2>Order History</h2>
        <div className="history-card">
          <h3>🍕 Pizza</h3>
          <p>Quantity: 2</p>
          <p>Total: ₹598</p>
          <p>Status: Delivered</p>
        </div>
        <div className="history-card">
          <h3>🍔 Burger</h3>
          <p>Quantity: 1</p>
          <p>Total: ₹199</p>
          <p>Status: Preparing</p>
        </div>
        <div className="history-card">
          <h3>🍝 Pasta</h3>
          <p>Quantity: 3</p>
          <p>Total: ₹747</p>
          <p>Status: Delivered</p>
        </div>
      </div>

      {/* Customer Login */}
      <div className="login">
        <h2>Customer Login</h2>
        <form className="login-form">
          <input type="email" placeholder="Enter Your Email" />
          <input type="password" placeholder="Enter Your Password" />
          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>

      {/* Customer Registration */}
      <div className="register">
        <h2>Customer Registration</h2>
        <form className="register-form">
          <input type="text" placeholder="Enter Your Name" />
          <input type="email" placeholder="Enter Your Email" />
          <input type="tel" placeholder="Enter Your Phone Number" />
          <input type="password" placeholder="Create Password" />
          <input type="password" placeholder="Confirm Password" />
          <button type="submit" className="btn">
            Register
          </button>
        </form>
      </div>

      {/* Admin Login Section */}
      <div className="admin-login">
        <h2>Admin Login</h2>
        <form className="admin-login-form">
          <input type="text" placeholder="Enter Admin Username" />
          <input type="password" placeholder="Enter Admin Password" />
          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>

      <ManageMenu />

      {/* Contact Section */}
      <div className="contact">
        <h2>Contact Us</h2>
        <p>📧 Email: lavanyarestaurant@gmail.com</p>
        <p>📞 Phone: +91 9876543210</p>
        <p>📍 Address: Hyderabad, Telangana</p>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Lavanya's Restaurant | All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
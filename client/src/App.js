import "./App.css";
import { useState } from "react";
import pizza from "./images/pizza.jpg";
import burger from "./images/burger.jpg";
import pasta from "./images/pasta.jpg";
import salad from "./images/salad.jpg";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">🍽️ Lavanya's Restaurant</h2>

        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Menu</li>
          <li>Contact</li>
        </ul>

        <button className="btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
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

      {/* Menu Section */}
      <div className="menu">
        <h2>Our Special Menu</h2>
        <div className="menu-items">
          <div className="card">
            <img src={pizza} alt="Pizza" />
            <h3>🍕 Pizza</h3>
            <p>₹299</p>
          </div>
          <div className="card">
            <img src={burger} alt="Burger" />
            <h3>🍔 Burger</h3>
            <p>₹199</p>
          </div>
          <div className="card">
            <img src={pasta} alt="Pasta" />
            <h3>🍝 Pasta</h3>
            <p>₹249</p>
          </div>
          <div className="card">
            <img src={salad} alt="Salad" />
            <h3>🥗 Salad</h3>
            <p>₹149</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="about">
        <h2>About Us</h2>
        <p>
          Welcome to Lavanya's Restaurant! We serve delicious and fresh food
          prepared with high-quality ingredients. Our mission is to provide
          tasty meals, excellent service, and unforgettable dining experiences.
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

    <input
      type="text"
      placeholder="Enter Your Name"
    />

    <input
      type="email"
      placeholder="Enter Your Email"
    />

    <input
      type="tel"
      placeholder="Enter Your Phone Number"
    />

    <input
      type="number"
      placeholder="Number of Guests"
    />

    <input
      type="date"
    />

    <input
      type="time"
    />

    <button type="submit" className="btn">
      Reserve Table
    </button>

  </form>
</div>

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
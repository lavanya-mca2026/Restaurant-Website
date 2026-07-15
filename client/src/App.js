import "./App.css";

function App() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">🍽️ Lavanya's Restaurant</h2>

        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Menu</li>
          <li>Contact</li>
        </ul>
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
            <h3>🍕 Pizza</h3>
            <p>₹299</p>
          </div>

          <div className="card">
            <h3>🍔 Burger</h3>
            <p>₹199</p>
          </div>

          <div className="card">
            <h3>🍝 Pasta</h3>
            <p>₹249</p>
          </div>

          <div className="card">
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

    </div>
  );
}

export default App;
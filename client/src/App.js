import "./App.css";

function App() {
  return (
    <div>
      <nav className="navbar">
        <h2 className="logo">🍽️ Lavanya's Restaurant</h2>

        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Menu</li>
          <li>Contact</li>
        </ul>
      </nav>

      <div className="container">
        <h1>Delicious Food, Happy Moments!</h1>

        <p>
          Experience the best food in town with fresh ingredients,
          fast delivery, and unforgettable taste.
        </p>

        <button className="btn">Explore Menu</button>
      </div>

      {/* 👇 Paste the menu section HERE */}

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

    </div>
  );
}

export default App;
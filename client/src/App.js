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

        <button>Explore Menu</button>
      </div>

    </div>
  );
}

export default App;
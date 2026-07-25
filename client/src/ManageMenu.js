import React, { useState } from "react";

function ManageMenu() {
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);

  const addItem = () => {
    if (foodName === "" || price === "") {
      alert("Please fill all fields");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: foodName,
      price: price,
    };

    setItems([...items, newItem]);
    setFoodName("");
    setPrice("");
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Menu</h2>

      <input
        type="text"
        placeholder="Food Name"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={addItem}>Add Item</button>

      <h3>Food Items</h3>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - ₹{item.price}
            <button
              onClick={() => deleteItem(item.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageMenu;
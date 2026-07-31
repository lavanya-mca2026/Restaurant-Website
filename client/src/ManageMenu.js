import React, { useState } from "react";

function ManageMenu() {
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [items, setItems] = useState([
    { id: 1, name: "Pizza", price: 299, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591" },
    { id: 2, name: "Burger", price: 199, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" }
  ]);

  const addItem = () => {
    if (foodName === "" || price === "" || image === "") {
      alert("Please fill all fields");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: foodName,
      price: price,
      image: image
    };

    setItems([...items, newItem]);
    setFoodName("");
    setPrice("");
    setImage("");
  };

  const deleteItem = (id) => {
    if(window.confirm("Are you sure you want to delete?")){
      setItems(items.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="admin-panel" style={{ padding: "30px", background: "#fff", margin: "20px", borderRadius: "10px" }}>
      <h2>🍽️ Admin - Manage Menu</h2>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "250px" }}
        />
        <button onClick={addItem} className="btn">Add Item</button>
      </div>

      <h3>Total Items: {items.length}</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
        {items.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px", background: "#fff8f0" }}>
            <img src={item.image} alt={item.name} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }} />
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
            <button onClick={() => deleteItem(item.id)} className="btn" style={{ background: "red" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageMenu;
import { useState, useEffect } from "react";

function ManageMenu({ getOrderStatus }) {
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", image: "" });
  const [reservations, setReservations] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchAll = async () => {
    try {
      const m = await fetch("http://localhost:5000/api/menu").then(r=>r.json());
      const r = await fetch("http://localhost:5000/api/reservations").then(r=>r.json());
      const e = await fetch("http://localhost:5000/api/enquiries").then(r=>r.json());
      const o = await fetch("http://localhost:5000/api/orders").then(r=>r.json());
      setMenu(m); setReservations(r); setEnquiries(e); setOrders(o);
    } catch { console.log("Backend not running"); }
  };

  useEffect(() => {
    fetchAll();
    const t = setInterval(fetchAll, 2000);
    return () => clearInterval(t);
  }, []);

  const addItem = async () => {
    if (!newItem.name || !newItem.price) { alert("Fill name and price"); return; }
    const res = await fetch("http://localhost:5000/api/menu", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });
    const data = await res.json();
    setMenu([...menu, data.item]);
    setNewItem({ name: "", price: "", image: "" });
    alert("Added");
  };

  const deleteItem = async (id) => {
    if(!window.confirm("Delete this food item?")) return;
    await fetch("http://localhost:5000/api/menu/" + id, { method: "DELETE" });
    setMenu(menu.filter((x) => x.id !== id));
  };
  const deleteRes = async (id) => {
    await fetch(`http://localhost:5000/api/reservations/${id}`, {method:"DELETE"});
    setReservations(reservations.filter(r=> r.id!== id));
  };
  const deleteEnq = async (id) => {
    await fetch(`http://localhost:5000/api/enquiries/${id}`, {method:"DELETE"});
    setEnquiries(enquiries.filter(e=> e.id!== id));
  };
  const deleteOrder = async (id) => {
    await fetch(`http://localhost:5000/api/orders/${id}`, {method:"DELETE"});
    setOrders(orders.filter(o=> o.id!== id));
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2 style={{color:"#D4AF37"}}>Admin Panel - Lavanya Kitchen - Premium</h2>
      <button className="btn" onClick={fetchAll}>🔄 Refresh Data</button>

      <h3 style={{marginTop:"20px"}}>📊 Dashboard Analytics - 8 Bonus Features</h3>
      <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap", margin: "20px" }}>
        <div className="card" style={{border:"2px solid #D4AF37"}}><h2>{menu.length}</h2><p>Menu Items</p></div>
        <div className="card" style={{border:"2px solid #4CAF50"}}><h2>{reservations.length}</h2><p>Reservations</p></div>
        <div className="card" style={{border:"2px solid #FF9800"}}><h2>{orders.length}</h2><p>Orders</p></div>
        <div className="card" style={{border:"2px solid #2196F3"}}><h2>{enquiries.length}</h2><p>Enquiries</p></div>
      </div>

      <h3>Add New Food</h3>
      <input placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
      <input placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
      <input placeholder="Image URL" value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} />
      <button className="btn" onClick={addItem}>Add Item</button>

      <h3 style={{marginTop:"30px"}}>🍕 Manage Menu - {menu.length} Items</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" }}>
        {menu.map((item) => (
          <div key={item.id} className="card" style={{width:"220px"}}>
            <img src={item.image} alt={item.name} width="150" height="100" style={{borderRadius:"10px", objectFit:"cover"}}/>
            <h4>{item.name}</h4>
            <p style={{color:"#D4AF37", fontWeight:"bold"}}>Rs {item.price}</p>
            <button onClick={() => deleteItem(item.id)} style={{background:"red", color:"white", border:"none", padding:"6px 12px", borderRadius:"8px", cursor:"pointer"}}>Delete</button>
          </div>
        ))}
      </div>

      <h3 style={{marginTop:"40px"}}>📅 Reservations - {reservations.length}</h3>
      {reservations.length===0 ? <p>No reservations yet</p> : reservations.map((r) => (
        <div key={r.id} className="history-card">
          <b>{r.name}</b> | {r.phone} | {r.email}<br/>
          Guests: {r.guests} | Date: {r.date} | Time: {r.time} | {r.createdAt}
          <br/><button onClick={()=>deleteRes(r.id)} style={{marginTop:"8px", background:"#ff4444", color:"white", border:"none", padding:"5px 10px", borderRadius:"6px", cursor:"pointer"}}>Delete Reservation</button>
        </div>
      ))}

      <h3>📦 Orders - {orders.length} - Live Tracking</h3>
      {orders.length===0 ? <p>No orders yet</p> : orders.map((o) => {
        const status = getOrderStatus ? getOrderStatus(o) : { text: "Confirmed", timeLeft: "", color: "orange"};
        return(
          <div key={o.id} className="history-card" style={{borderLeft:`5px solid ${status.color}`}}>
            <b>Order #{o.id}</b> - Rs {o.total} {o.discount>0 && `(Discount Rs ${o.discount})`} - {o.paymentMethod}<br/>
            User: {o.user} | Date: {o.date}<br/>
            Items: {o.items?.map(i=>i.name).join(", ")}<br/>
            <b style={{color:status.color}}>Status: {status.text} - {status.timeLeft}</b>
            <br/>
            <button onClick={()=>window.print()} style={{margin:"5px", padding:"5px 10px"}}>🧾 Print Bill</button>
            <button onClick={()=>deleteOrder(o.id)} style={{margin:"5px", background:"#ff4444", color:"white", border:"none", padding:"5px 10px", borderRadius:"6px"}}>Delete Order</button>
          </div>
        );
      })}

      <h3>💬 Customer Enquiries - {enquiries.length}</h3>
      {enquiries.length===0 ? <p>No enquiries yet</p> : enquiries.map((q) => (
        <div key={q.id} className="history-card">
          <b>{q.name}</b> | {q.email}<br/>{q.message}<br/><small>{q.createdAt}</small>
          <br/><button onClick={()=>deleteEnq(q.id)} style={{marginTop:"8px", background:"#ff4444", color:"white", border:"none", padding:"5px 10px", borderRadius:"6px"}}>Delete Enquiry</button>
        </div>
      ))}
    </div>
  );
}
export default ManageMenu;

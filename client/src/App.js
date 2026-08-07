/* eslint-disable */
import { useState, useEffect } from "react";
import "./App.css";
import ManageMenu from "./ManageMenu";

const API_URL = "https://restaurant-website-oddh.onrender.com";

function App() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name:"", email:"", password:"" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [showFavOnly, setShowFavOnly] = useState(false);

  const [menu, setMenu] = useState([
    { id: 1, name: "Margherita Pizza", price: 299, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591", rating: 4.5 },
    { id: 3, name: "Pasta Alfredo", price: 249, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9", rating: 4.6 },
    { id: 4, name: "French Fries", price: 99, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877", rating: 4.2 },
    { id: 5, name: "Biryani", price: 349, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8", rating: 4.8 },
    { id: 6, name: "Chocolate Cake", price: 149, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587", rating: 4.7 }
  ]);
  const [reservation, setReservation] = useState({ name: "", email: "", phone: "", guests: 1, date: "", time: "" });
  const [enquiry, setEnquiry] = useState({ name: "", email: "", message: "" });
  const [orders, setOrders] = useState([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    fetch(`${API_URL}/api/menu`).then(r=>r.json()).then(d=>{if(Array.isArray(d) && d.length>0) setMenu(d)}).catch(()=>{});
    const savedOrders = localStorage.getItem("orders");
    if(savedOrders) setOrders(JSON.parse(savedOrders));
    const savedUser = localStorage.getItem("user");
    if(savedUser) setUser(JSON.parse(savedUser));
    const savedFav = localStorage.getItem("favorites");
    if(savedFav) setFavorites(JSON.parse(savedFav));
    const timer = setInterval(()=> setCurrentTime(Date.now()), 1000);
    return ()=> clearInterval(timer);
  }, []);

  useEffect(()=>{ localStorage.setItem("orders", JSON.stringify(orders)); }, [orders]);
  useEffect(()=>{ localStorage.setItem("favorites", JSON.stringify(favorites)); }, [favorites]);

  const filteredFoods = menu.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchFav = showFavOnly ? favorites.find(x=>x.id===f.id) : true;
    return matchSearch && matchFav;
  });

  const addToCart = (food) => setCart([...cart, food]);
  const removeFromCart = (idx) => setCart(cart.filter((_, i) => i!== idx));
  const totalPrice = cart.reduce((s, i) => s + Number(i.price), 0);
  const finalPrice = Math.max(0, totalPrice - discount);

  const toggleFavorite = (food) => {
    if(favorites.find(f=>f.id===food.id)){
      setFavorites(favorites.filter(f=>f.id!==food.id));
    } else {
      setFavorites([...favorites, food]);
    }
  };
  const rateFood = (id, stars) => {
    setRatings({...ratings, [id]: stars});
  };

  const scrollTo = (id) => {
    if(showAdmin) setShowAdmin(false);
    document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  };

  const applyPromo = () => {
    if(promoCode==="LAVANYA10"){ setDiscount(Math.floor(totalPrice*0.10)); alert("LAVANYA10 Applied! 10% OFF"); }
    else if(promoCode==="WELCOME20"){ setDiscount(Math.floor(totalPrice*0.20)); alert("WELCOME20 Applied! 20% OFF"); }
    else if(promoCode===""){ alert("Enter Promo Code"); }
    else{ alert("Invalid Code! Try LAVANYA10 or WELCOME20"); setDiscount(0); }
  };

  const getOrderStatus = (order) => {
    if(!order.deliveryTime) return { text: "Confirmed", timeLeft: "30 mins", color: "orange" };
    const diff = order.deliveryTime - currentTime;
    if(diff <= 0) return { text: "Delivered", timeLeft: "Delivered!", color: "green" };
    const mins = Math.floor(diff/60000);
    const secs = Math.floor((diff%60000)/1000);
    if(mins > 20) return { text: "Confirmed - Preparing", timeLeft: `${mins}m ${secs}s left`, color: "orange" };
    if(mins > 10) return { text: "Cooking - Almost Ready", timeLeft: `${mins}m ${secs}s left`, color: "blue" };
    if(mins > 0) return { text: "Out for Delivery", timeLeft: `${mins}m ${secs}s left`, color: "red" };
    return { text: "Arriving Now", timeLeft: `${secs}s left`, color: "red" };
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    try{
      const res = await fetch(`${API_URL}/api/reserve`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(reservation) });
      const data = await res.json(); alert(data.message);
    } catch { alert("Reservation saved locally!"); }
    setReservation({ name: "", email: "", phone: "", guests: 1, date: "", time: "" });
  };

  const handleEnquiry = async (e) => {
    e.preventDefault();
    try{ await fetch(`${API_URL}/api/enquiry`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(enquiry) }); }catch{}
    alert("Enquiry sent!"); setEnquiry({ name: "", email: "", message: "" });
  };

  const handlePlaceOrder = async () => {
    if(cart.length===0) { alert("Cart empty"); return; }
    if(!user) { alert("Please Login first!"); setShowLogin(true); return; }
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 30*60000);
    const orderData = { id: Date.now(), items: cart, total: finalPrice, actualTotal: totalPrice, discount: discount, paymentMethod: paymentMethod, promoCode: promoCode, date: now.toLocaleString(), orderTime: now.getTime(), deliveryTime: deliveryTime.getTime(), user: user.email, status: "Confirmed" };
    try{ await fetch(`${API_URL}/api/orders`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(orderData) }); }catch{}
    setOrders([...orders, orderData]);
    setCart([]); setDiscount(0); setPromoCode("");
    alert(`Order Placed! Paid Rs ${finalPrice} via ${paymentMethod}. Delivery in 30 mins`);
    scrollTo("orders");
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if(authMode==="register" &&!authForm.name) { alert("Enter name"); return; }
    const userData = { name: authForm.name || "Lavanya", email: authForm.email };
    setUser(userData); localStorage.setItem("user", JSON.stringify(userData));
    setShowLogin(false); setAuthForm({ name:"", email:"", password:"" });
    alert(authMode==="login"? "Login Successful!" : "Registration Successful!");
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem("user"); alert("Logged out"); };

  return (
    <div className={darkMode? "dark-mode" : "light-mode"}>
      <nav className="navbar">
        <h2 className="logo">Lavanya Kitchen 👑</h2>
        <ul className="nav-links">
          <li onClick={()=>scrollTo("home")}>Home</li>
          <li onClick={()=>scrollTo("menu")}>Menu</li>
          <li onClick={()=>scrollTo("cart")}>Cart ({cart.length})</li>
          <li onClick={()=>setShowFavOnly(!showFavOnly)}>❤ Fav ({favorites.length})</li>
          <li onClick={()=>scrollTo("orders")}>Orders</li>
          <li onClick={()=>scrollTo("contact")}>Contact</li>
          <li onClick={()=>setShowAdmin(!showAdmin)}>{showAdmin? "Home" : "Admin"}</li>
          <li onClick={()=>setDarkMode(!darkMode)}>{darkMode? "☀ Light" : "🌙 Dark"}</li>
          {user? <li onClick={handleLogout}>Hi {user.name}</li> : <li onClick={()=>setShowLogin(true)}>Login</li>}
        </ul>
      </nav>

      {showLogin && (
        <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.7)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:999}}>
          <form onSubmit={handleAuth} style={{background:"white",padding:"30px",borderRadius:"15px",width:"320px"}}>
            <h3 style={{color:"#D4AF37"}}>{authMode==="login"? "Customer Login" : "Register"}</h3>
            {authMode==="register" && <input required placeholder="Name" value={authForm.name} onChange={e=>setAuthForm({...authForm, name:e.target.value})} style={{width:"100%",margin:"8px 0",padding:"12px"}}/>}
            <input required type="email" placeholder="Email" value={authForm.email} onChange={e=>setAuthForm({...authForm, email:e.target.value})} style={{width:"100%",margin:"8px 0",padding:"12px"}}/>
            <input required type="password" placeholder="Password" value={authForm.password} onChange={e=>setAuthForm({...authForm, password:e.target.value})} style={{width:"100%",margin:"8px 0",padding:"12px"}}/>
            <button type="submit" className="btn" style={{width:"100%",marginTop:"10px"}}>{authMode==="login"? "Login" : "Register"}</button>
            <p onClick={()=>setAuthMode(authMode==="login"? "register" : "login")} style={{cursor:"pointer",color:"#D4AF37",marginTop:"12px",textAlign:"center"}}>{authMode==="login"? "New user? Register" : "Already user? Login"}</p>
            <button type="button" onClick={()=>setShowLogin(false)} style={{width:"100%",marginTop:"8px", padding:"10px"}}>Close</button>
          </form>
        </div>
      )}

      {showAdmin? <ManageMenu getOrderStatus={getOrderStatus} /> : (
        <>
          <div id="home" className="container">
            <h1>Welcome to Lavanya Premium Restaurant</h1>
            <p>Authentic Taste, Premium Quality, Family Dining - Since 2020</p>
            <button className="btn" onClick={()=>scrollTo("menu")}>Explore Premium Menu</button>
          </div>

          <div id="menu" className="menu">
            <h2 style={{color:"#D4AF37"}}>Our Premium Food Menu - {filteredFoods.length} Items</h2>
            <div className="menu-items">
              {filteredFoods.map(food => (
                <div key={food.id} className="card">
                  <img src={food.image} alt={food.name} />
                  <h3>{food.name}</h3>
                  <p>Rs {food.price}</p>
                  <p style={{color:"#FFA500"}}>⭐ {ratings[food.id] || food.rating || 4.5} Rating</p>
                  <div style={{display:"flex", gap:"8px", justifyContent:"center", marginTop:"10px"}}>
                    <button className="btn" onClick={()=>addToCart(food)} style={{padding:"8px 16px"}}>Add to Cart</button>
                    <button onClick={()=>toggleFavorite(food)} style={{background: favorites.find(f=>f.id===food.id)? "#ff4444" : "#eee", color: favorites.find(f=>f.id===food.id)? "white" : "#333", border:"none", padding:"8px 12px", borderRadius:"10px", cursor:"pointer"}}>
                      {favorites.find(f=>f.id===food.id)? "❤" : "🤍"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="cart" className="cart-section">
            <h2 style={{color:"#D4AF37"}}>🛒 Your Cart</h2>
            {cart.length===0? <p>Cart empty</p> : (
              <>
                {cart.map((item, i) => <div key={i} className="cart-item"><span>{item.name} - Rs {item.price}</span><button onClick={()=>removeFromCart(i)} style={{background:"red", color:"white", border:"none", padding:"5px 10px", borderRadius:"5px", cursor:"pointer"}}>Remove</button></div>)}
                <h3>Total: Rs {totalPrice} {discount>0 && <span style={{color:"green"}}> - Discount Rs {discount} = Rs {finalPrice}</span>}</h3>
                <div style={{margin:"20px auto",maxWidth:"550px",textAlign:"left",background:"#fff9e6",padding:"20px",borderRadius:"15px", border:"2px solid #D4AF37"}}>
                  <h3>💳 Payment Method</h3>
                  <label style={{display:"block", margin:"8px 0"}}><input type="radio" name="pay" checked={paymentMethod==="COD"} onChange={()=>setPaymentMethod("COD")} /> Cash on Delivery</label>
                  <label style={{display:"block", margin:"8px 0"}}><input type="radio" name="pay" checked={paymentMethod==="UPI"} onChange={()=>setPaymentMethod("UPI")} /> UPI / GPay</label>
                  <label style={{display:"block", margin:"8px 0"}}><input type="radio" name="pay" checked={paymentMethod==="Card"} onChange={()=>setPaymentMethod("Card")} /> Card</label>
                  <h4>🎁 Promo Codes</h4>
                  <div style={{display:"flex", gap:"10px", marginTop:"10px"}}>
                    <input placeholder="Enter LAVANYA10" value={promoCode} onChange={e=>setPromoCode(e.target.value)} style={{padding:"10px",flex:1, borderRadius:"8px", border:"1px solid #D4AF37"}} />
                    <button onClick={applyPromo} style={{padding:"10px 20px", background:"#D4AF37", color:"white", border:"none", borderRadius:"8px", cursor:"pointer"}}>Apply</button>
                  </div>
                </div>
                <button className="btn" onClick={handlePlaceOrder} style={{fontSize:"18px", padding:"15px 35px"}}>Pay Rs {finalPrice} via {paymentMethod} & Place Order 🚀</button>
              </>
            )}
          </div>

          <div id="orders" className="cart-section">
            <h2 style={{color:"#D4AF37"}}>📦 Order History</h2>
            {orders.length===0? <p>No orders yet.</p> : orders.map(o=>{
              const statusInfo = getOrderStatus(o);
              return(
                <div key={o.id} className="history-card" style={{borderLeft:`6px solid ${statusInfo.color}`}}>
                  <b>Order #{o.id}</b> - {o.date} - <b>Rs {o.total}</b><br/>
                  <span>Items: {o.items.map(i=>i.name).join(" | ")}</span><br/>
                  <b style={{color: statusInfo.color}}>Status: {statusInfo.text} - {statusInfo.timeLeft}</b>
                </div>
              );
            })}
          </div>

          <div id="reserve" className="reservation">
            <h2 style={{color:"#D4AF37"}}>📅 Reserve a Table</h2>
            <form onSubmit={handleReserve} style={{marginTop:"20px"}}>
              <input required placeholder="Full Name" value={reservation.name} onChange={e=>setReservation({...reservation, name:e.target.value})} />
              <input required placeholder="Email" type="email" value={reservation.email} onChange={e=>setReservation({...reservation, email:e.target.value})} />
              <input required placeholder="Phone" value={reservation.phone} onChange={e=>setReservation({...reservation, phone:e.target.value})} />
              <input required type="number" min="1" max="20" placeholder="Guests" value={reservation.guests} onChange={e=>setReservation({...reservation, guests:e.target.value})} />
              <input required type="date" value={reservation.date} onChange={e=>setReservation({...reservation, date:e.target.value})} />
              <input required type="time" value={reservation.time} onChange={e=>setReservation({...reservation, time:e.target.value})} />
              <button type="submit" className="btn">Reserve Table 🥂</button>
            </form>
          </div>

          <div id="contact" className="reservation">
            <h2 style={{color:"#D4AF37"}}>💬 Contact Us</h2>
            <form onSubmit={handleEnquiry} style={{marginTop:"20px"}}>
              <input required placeholder="Your Name" value={enquiry.name} onChange={e=>setEnquiry({...enquiry, name:e.target.value})} />
              <input required type="email" placeholder="Your Email" value={enquiry.email} onChange={e=>setEnquiry({...enquiry, email:e.target.value})} />
              <textarea required placeholder="Your Message" value={enquiry.message} onChange={e=>setEnquiry({...enquiry, message:e.target.value})} style={{width:"80%",height:"100px",margin:"10px",padding:"12px"}}></textarea>
              <button type="submit" className="btn">Send Message 📨</button>
            </form>
          </div>

          <footer className="footer">
            <p>© 2026 Lavanya Kitchen 👑</p>
          </footer>
        </>
      )}
    </div>
  );
}
export default App;
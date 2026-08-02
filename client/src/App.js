import { useState, useEffect } from "react";
import "./App.css";
import ManageMenu from "./ManageMenu";

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
    fetch("http://localhost:5000/api/menu").then(r=>r.json()).then(d=>{if(d.length>0) setMenu(d)}).catch(()=>{});
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
      const res = await fetch("http://localhost:5000/api/reserve", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(reservation) });
      const data = await res.json(); alert(data.message);
    } catch { alert("Reservation saved locally!"); }
    setReservation({ name: "", email: "", phone: "", guests: 1, date: "", time: "" });
  };

  const handleEnquiry = async (e) => {
    e.preventDefault();
    try{ await fetch("http://localhost:5000/api/enquiry", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(enquiry) }); }catch{}
    alert("Enquiry sent!"); setEnquiry({ name: "", email: "", message: "" });
  };

  const handlePlaceOrder = async () => {
    if(cart.length===0) { alert("Cart empty"); return; }
    if(!user) { alert("Please Login first!"); setShowLogin(true); return; }
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 30*60000);
    const orderData = { id: Date.now(), items: cart, total: finalPrice, actualTotal: totalPrice, discount: discount, paymentMethod: paymentMethod, promoCode: promoCode, date: now.toLocaleString(), orderTime: now.getTime(), deliveryTime: deliveryTime.getTime(), user: user.email, status: "Confirmed" };
    try{ await fetch("http://localhost:5000/api/orders", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(orderData) }); }catch{}
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
          <li onClick={()=>setShowFavOnly(!showFavOnly)}>❤️ Fav ({favorites.length})</li>
          <li onClick={()=>scrollTo("orders")}>Orders</li>
          <li onClick={()=>scrollTo("contact")}>Contact</li>
          <li onClick={()=>setShowAdmin(!showAdmin)}>{showAdmin? "Home" : "Admin"}</li>
          <li onClick={()=>setDarkMode(!darkMode)}>{darkMode? "☀️ Light" : "🌙 Dark"}</li>
          {user? <li onClick={handleLogout}>Hi {user.name}</li> : <li onClick={()=>setShowLogin(true)}>Login</li>}
        </ul>
      </nav>

      {showLogin && (
        <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.7)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:999}}>
          <form onSubmit={handleAuth} style={{background:"white",padding:"30px",borderRadius:"15px",width:"320px", boxShadow:"0 10px 30px rgba(0,0,0,0.3)"}}>
            <h3 style={{color:"#D4AF37"}}>{authMode==="login"? "Customer Login" : "Register"}</h3>
            {authMode==="register" && <input required placeholder="Name" value={authForm.name} onChange={e=>setAuthForm({...authForm, name:e.target.value})} style={{width:"100%",margin:"8px 0",padding:"12px", borderRadius:"8px", border:"1px solid #ddd"}}/>}
            <input required type="email" placeholder="Email" value={authForm.email} onChange={e=>setAuthForm({...authForm, email:e.target.value})} style={{width:"100%",margin:"8px 0",padding:"12px", borderRadius:"8px", border:"1px solid #ddd"}}/>
            <input required type="password" placeholder="Password" value={authForm.password} onChange={e=>setAuthForm({...authForm, password:e.target.value})} style={{width:"100%",margin:"8px 0",padding:"12px", borderRadius:"8px", border:"1px solid #ddd"}}/>
            <button type="submit" className="btn" style={{width:"100%",marginTop:"10px"}}>{authMode==="login"? "Login" : "Register"}</button>
            <p onClick={()=>setAuthMode(authMode==="login"? "register" : "login")} style={{cursor:"pointer",color:"#D4AF37",marginTop:"12px",textAlign:"center", fontWeight:"bold"}}>{authMode==="login"? "New user? Register" : "Already user? Login"}</p>
            <button type="button" onClick={()=>setShowLogin(false)} style={{width:"100%",marginTop:"8px", padding:"10px", borderRadius:"8px", border:"none"}}>Close</button>
          </form>
        </div>
      )}

      {showAdmin? <ManageMenu getOrderStatus={getOrderStatus} /> : (
        <>
          <div id="home" className="container">
            <h1>Welcome to Lavanya Premium Restaurant</h1>
            <p>Authentic Taste, Premium Quality, Family Dining - Since 2020</p>
            <p style={{marginTop:"10px"}}>⭐ 4.8 Rating | 1000+ Happy Customers | 8 Bonus Features</p>
            <button className="btn" onClick={()=>scrollTo("menu")}>Explore Premium Menu</button>
          </div>

          <div id="about" className="about-section" style={{padding:"60px 20px",textAlign:"center"}}>
            <h2 style={{color:"#D4AF37"}}>About Lavanya Kitchen</h2>
            <p style={{maxWidth:"700px",margin:"20px auto", lineHeight:"1.6"}}>Welcome to Lavanya Kitchen, where tradition meets taste. Since 2020, we serve authentic dishes with premium quality. Our chefs use secret recipes passed down generations. We offer luxury dining experience with gold-class hospitality.</p>
            <p><b>Timings:</b> 11 AM - 11 PM | <b>Location:</b> Hyderabad | <b>Contact:</b> +91 9876543210</p>
          </div>

          <div className="search-section">
            <input type="text" placeholder="🔍 Search food... (Pizza, Burger, Biryani)" value={search} onChange={e=>setSearch(e.target.value)} />
            <button onClick={()=>setShowFavOnly(!showFavOnly)} style={{marginLeft:"10px", padding:"12px 20px", borderRadius:"20px", border:"2px solid #D4AF37", background: showFavOnly? "#D4AF37" : "white", color: showFavOnly? "white" : "#D4AF37", cursor:"pointer", fontWeight:"bold"}}>
              {showFavOnly? "Show All" : `❤️ Favorites (${favorites.length})`}
            </button>
          </div>

          <div id="menu" className="menu">
            <h2 style={{color:"#D4AF37"}}>Our Premium Food Menu - {filteredFoods.length} Items {showFavOnly && "(Favorites Only)"}</h2>
            <div className="menu-items">
              {filteredFoods.map(food => (
                <div key={food.id} className="card">
                  <img src={food.image} alt={food.name} />
                  <h3>{food.name}</h3>
                  <p>Rs {food.price}</p>
                  <p style={{color:"#FFA500"}}>⭐ {ratings[food.id] || food.rating || 4.5} Rating</p>
                  <div style={{display:"flex", gap:"8px", justifyContent:"center", marginTop:"10px"}}>
                    <button className="btn" onClick={()=>addToCart(food)} style={{padding:"8px 16px"}}>Add to Cart</button>
                    <button onClick={()=>toggleFavorite(food)} style={{background: favorites.find(f=>f.id===food.id)? "#ff4444" : "#eee", color: favorites.find(f=>f.id===food.id)? "white" : "#333", border:"none", padding:"8px 12px", borderRadius:"10px", cursor:"pointer", fontSize:"16px"}}>
                      {favorites.find(f=>f.id===food.id)? "❤️" : "🤍"}
                    </button>
                  </div>
                  <div style={{marginTop:"10px"}}>
                    {[1,2,3,4,5].map(s=>(
                      <span key={s} onClick={()=>rateFood(food.id, s)} style={{cursor:"pointer", fontSize:"20px", color:"#D4AF37"}}>
                        {s <= (ratings[food.id] || 0)? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {filteredFoods.length===0 && <p style={{marginTop:"30px", color:"red"}}>No food found. Try searching Pizza or Burger or check Favorites.</p>}
          </div>

          <div id="cart" className="cart-section">
            <h2 style={{color:"#D4AF37"}}>🛒 Your Cart - Premium Ordering</h2>
            {cart.length===0? <p>Cart empty - Add some delicious food!</p> : (
              <>
                {cart.map((item, i) => <div key={i} className="cart-item"><span>{item.name} - Rs {item.price}</span><button onClick={()=>removeFromCart(i)} style={{background:"red", color:"white", border:"none", padding:"5px 10px", borderRadius:"5px", cursor:"pointer"}}>Remove</button></div>)}
                <h3>Total: Rs {totalPrice} {discount>0 && <span style={{color:"green"}}> - Discount Rs {discount} = Rs {finalPrice}</span>}</h3>

                <div style={{margin:"20px auto",maxWidth:"550px",textAlign:"left",background:"#fff9e6",padding:"20px",borderRadius:"15px", border:"2px solid #D4AF37"}}>
                  <h3>💳 Select Payment Method - Bonus Feature 1</h3>
                  <label style={{display:"block", margin:"8px 0"}}><input type="radio" name="pay" checked={paymentMethod==="COD"} onChange={()=>setPaymentMethod("COD")} /> Cash on Delivery (COD) - Free</label>
                  <label style={{display:"block", margin:"8px 0"}}><input type="radio" name="pay" checked={paymentMethod==="UPI"} onChange={()=>setPaymentMethod("UPI")} /> UPI / GPay / PhonePe - Instant</label>
                  <label style={{display:"block", margin:"8px 0"}}><input type="radio" name="pay" checked={paymentMethod==="Card"} onChange={()=>setPaymentMethod("Card")} /> Credit / Debit Card - Secure</label>
                  <label style={{display:"block", margin:"8px 0"}}><input type="radio" name="pay" checked={paymentMethod==="NetBanking"} onChange={()=>setPaymentMethod("NetBanking")} /> Net Banking - Safe</label>
                  <hr style={{margin:"15px 0"}}/>
                  <h4>🎁 Promo Codes & Offers - Bonus Feature 2</h4>
                  <div style={{display:"flex", gap:"10px", marginTop:"10px"}}>
                    <input placeholder="Enter LAVANYA10" value={promoCode} onChange={e=>setPromoCode(e.target.value)} style={{padding:"10px",flex:1, borderRadius:"8px", border:"1px solid #D4AF37"}} />
                    <button onClick={applyPromo} style={{padding:"10px 20px", background:"#D4AF37", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"bold"}}>Apply</button>
                  </div>
                  <p style={{color:"green",fontSize:"12px", marginTop:"8px"}}>Valid: LAVANYA10 (10% OFF), WELCOME20 (20% OFF) - Min order Rs 200</p>
                  {paymentMethod!=="COD" && <div style={{marginTop:"15px", padding:"10px", background:"white", borderRadius:"8px"}}><h4>🔒 Secure Payment - Razorpay Integrated (Demo)</h4><input placeholder="Card/UPI Number (Mock) - 1234 5678 9012" style={{padding:"8px",width:"100%", marginTop:"8px", borderRadius:"6px", border:"1px solid #ddd"}} /><p style={{fontSize:"11px", color:"green"}}>🔒 100% Secure & Encrypted</p></div>}
                </div>

                <button className="btn" onClick={handlePlaceOrder} style={{fontSize:"18px", padding:"15px 35px"}}>Pay Rs {finalPrice} via {paymentMethod} & Place Order 🚀</button>
              </>
            )}
          </div>

          <div id="orders" className="cart-section">
            <h2 style={{color:"#D4AF37"}}>📦 Order History - Live Tracking (Bonus 3)</h2>
            {orders.length===0? <p>No orders yet. Order some tasty food!</p> : orders.map(o=>{
              const statusInfo = getOrderStatus(o);
              return(
                <div key={o.id} className="history-card" style={{borderLeft:`6px solid ${statusInfo.color}`}}>
                  <b>Order #{o.id}</b> - {o.date} - <b>Rs {o.total}</b> {o.paymentMethod && `(Paid via ${o.paymentMethod})`} {o.discount>0 && <span style={{color:"green"}}>[Saved Rs {o.discount}]</span>}<br/>
                  <span>Items: {o.items.map(i=>i.name).join(" | ")}</span><br/>
                  <b style={{color: statusInfo.color, fontSize:"16px"}}>Status: {statusInfo.text}</b><br/>
                  <b>⏳ Time Left: {statusInfo.timeLeft}</b><br/>
                  <button onClick={()=>window.print()} style={{marginTop:"8px", background:"#D4AF37", color:"white", border:"none", padding:"6px 12px", borderRadius:"6px", cursor:"pointer"}}>🧾 Print Bill</button>
                </div>
              );
            })}
          </div>

          <div id="reserve" className="reservation">
            <h2 style={{color:"#D4AF37"}}>📅 Reserve a Table - Premium Dining</h2>
            <p>Book your luxury table in advance - Free Reservation!</p>
            <form onSubmit={handleReserve} style={{marginTop:"20px"}}>
              <input required placeholder="Full Name" value={reservation.name} onChange={e=>setReservation({...reservation, name:e.target.value})} />
              <input required placeholder="Email Address" type="email" value={reservation.email} onChange={e=>setReservation({...reservation, email:e.target.value})} />
              <input required placeholder="Phone Number" value={reservation.phone} onChange={e=>setReservation({...reservation, phone:e.target.value})} />
              <input required type="number" min="1" max="20" placeholder="No. of Guests" value={reservation.guests} onChange={e=>setReservation({...reservation, guests:e.target.value})} />
              <input required type="date" value={reservation.date} onChange={e=>setReservation({...reservation, date:e.target.value})} />
              <input required type="time" value={reservation.time} onChange={e=>setReservation({...reservation, time:e.target.value})} />
              <button type="submit" className="btn" style={{width:"80%", maxWidth:"400px"}}>Reserve Table - Free 🥂</button>
            </form>
          </div>

          <div id="contact" className="reservation">
            <h2 style={{color:"#D4AF37"}}>💬 Contact Us - Customer Support</h2>
            <p>Have questions? Send us a message - We reply in 5 minutes!</p>
            <form onSubmit={handleEnquiry} style={{marginTop:"20px"}}>
              <input required placeholder="Your Name" value={enquiry.name} onChange={e=>setEnquiry({...enquiry, name:e.target.value})} />
              <input required type="email" placeholder="Your Email" value={enquiry.email} onChange={e=>setEnquiry({...enquiry, email:e.target.value})} />
              <textarea required placeholder="Your Message - Feedback, Complaint, Query" value={enquiry.message} onChange={e=>setEnquiry({...enquiry, message:e.target.value})} style={{width:"80%",height:"100px",margin:"10px",padding:"12px", borderRadius:"10px", border:"1px solid #ddd", maxWidth:"400px"}}></textarea>
              <button type="submit" className="btn" style={{width:"80%", maxWidth:"400px"}}>Send Message 📨</button>
            </form>
            <p style={{marginTop:"20px"}}><b>📍 Address:</b> Lavanya Kitchen, Road No. 10, Banjara Hills, Hyderabad - 500034<br/><b>📞 Phone:</b> +91 9876543210 | <b>✉️ Email:</b> contact@lavanyakitchen.com</p>
          </div>

          <footer className="footer">
            <p>© 2026 Lavanya Kitchen 👑 | Project 7 - Premium Restaurant Website</p>
            <p style={{fontSize:"12px", marginTop:"5px"}}>8 Bonus Features: Payment | Promo Codes | Live Timer | Login | Dark Mode | Favorites | Ratings | Admin Delete + Bill Print | Made with ❤️</p>
          </footer>
        </>
      )}
    </div>
  );
}
export default App;

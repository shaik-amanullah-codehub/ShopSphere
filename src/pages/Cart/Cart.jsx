// --- IMPORTS ---
import React, { useState, useEffect } from 'react'; // React core hooks
import { useNavigate } from 'react-router-dom'; // Navigation hook
import { useApp } from '../../context/AppContext'; // Context state hook
import { Trash2, ArrowLeft, CheckCircle, Truck, Store, MapPin, Plus, Minus } from 'lucide-react'; // Icons
import './Cart.css'; // Styles

// --- CONSTANTS ---
// Payment provider logo URLs
const [gpay, phonepe, paytm, bhim] = [
  "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg", // Google Pay
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png", // PhonePe
  "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg", // Paytm
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" // BHIM
];

// Mock database for physical stores
const STORES = [
  { id: 1, name: 'TechHaven Downtown', address: '12, MG Road, Mumbai - 400001', dist: '1.2 km' }, // Store 1
  { id: 2, name: 'TechHaven West', address: 'Shop 45, Andheri West, Mumbai - 400053', dist: '5.8 km' }, // Store 2
  { id: 3, name: 'TechHaven Express', address: 'Phoenix Marketcity, Mumbai - 400070', dist: '8.4 km' }, // Store 3
];

// --- SUB-COMPONENTS ---

// Renders the two main delivery options (Online vs Store)
const DeliveryModeSelector = ({ mode, setMode }) => ( // Component start
  <div className="cart-card fade-in"> {/* Card container */}
    <h3 className="card-title">Select Delivery Mode</h3> {/* Title */}
    <div className="mode-grid"> {/* Grid layout */}
      {/* Map through options to reduce code repetition */}
      {[{ id: 'online', Icon: Truck, t1: 'Online Delivery -', t2: 'Delivered to your doorstep' }, // Option 1 data
        { id: 'store', Icon: Store, t1: 'Visit Store -', t2: 'Pick up from nearby shop' } // Option 2 data
      ].map(({ id, Icon, t1, t2 }) => ( // Render loop
        <div key={id} className={`mode-card ${mode === id ? 'selected' : ''}`} onClick={() => setMode(id)}> {/* Card */}
          <div className="mode-icon"><Icon size={24} /></div> {/* Icon */}
          <div className="mode-info"><span className="mode-title">{t1}</span><span className="mode-desc">{t2}</span></div> {/* Text */}
          <div className="radio-circle"></div> {/* Radio UI */}
        </div> // End Card
      ))}
    </div> 
  </div> // End Container
);

// Renders the list of stores if "Visit Store" is chosen
const StoreSelector = ({ selId, setSelId }) => ( // Component start
  <div className="cart-card fade-in"> {/* Card container */}
    <h3 className="card-title">Select Store for Pickup</h3> {/* Title */}
    <div className="store-list"> {/* List container */}
      {STORES.map(s => ( // Loop stores
        <div key={s.id} className={`store-item ${selId === s.id ? 'active' : ''}`} onClick={() => setSelId(s.id)}> {/* Item */}
          <div className="store-icon"><MapPin size={20} /></div> {/* Pin Icon */}
          <div className="store-details"> {/* Details block */}
            <span className="store-name">{s.name}</span> {/* Name */}
            <span className="store-address">{s.address}</span> {/* Address */}
            <span className="store-distance">{s.dist} away</span> {/* Distance */}
          </div>
          <div className="radio-circle-small"></div> {/* Radio UI */}
        </div>
      ))}
    </div>
  </div>
);

// Renders address inputs for Online Delivery
const AddressForm = ({ addr, setAddr }) => ( // Component start
  <div className="cart-card fade-in"> {/* Card container */}
    <h3 className="card-title">Shipping Address</h3> {/* Title */}
    <div className="form-grid"> {/* Form layout */}
      {/* Helper to update state cleanly */}
      {['name', 'line1'].map(f => <input key={f} className="form-input" placeholder={f === 'name' ? 'Full Name' : 'Address Line 1'} value={addr[f]} onChange={e => setAddr({ ...addr, [f]: e.target.value })} />)} {/* Top inputs */}
      <div className="form-row"> {/* City/State row */}
        {['city', 'state'].map(f => <input key={f} className="form-input" placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={addr[f]} onChange={e => setAddr({ ...addr, [f]: e.target.value })} />)} {/* Inputs */}
      </div>
      <input className="form-input" placeholder="PIN Code" value={addr.pincode} onChange={e => setAddr({ ...addr, pincode: e.target.value })} /> {/* PIN */}
    </div>
  </div>
);

// Renders Payment options and Card inputs
const PaymentForm = ({ pay, setPay }) => ( // Component start
  <div className="cart-card fade-in" style={{ animationDelay: '0.1s' }}> {/* Container */}
    <h3 className="card-title">Payment Method</h3> {/* Title */}
    <div className="payment-options"> {/* Buttons container */}
      {['card', 'upi', 'cod'].map(m => ( // Loop methods
        <button key={m} type="button" className={`payment-btn ${pay.method === m ? 'active' : ''}`} onClick={() => setPay({ ...pay, method: m })}>{m.toUpperCase()}</button> // Button
      ))}
    </div>
    {pay.method === 'card' && ( // Show card inputs if selected
      <div className="card-details slide-down"> {/* Animation wrapper */}
        <input className="form-input" placeholder="Name on Card" value={pay.nameOnCard} onChange={e => setPay({ ...pay, nameOnCard: e.target.value })} /> {/* Name */}
        <input className="form-input" placeholder="Card Number" maxLength="16" value={pay.cardNumber} onChange={e => setPay({ ...pay, cardNumber: e.target.value })} /> {/* Number */}
        <div className="form-row"> {/* Row */}
          <input className="form-input" placeholder="MM/YY" maxLength="5" value={pay.expiry} onChange={e => setPay({ ...pay, expiry: e.target.value })} /> {/* Date */}
          <input className="form-input" placeholder="CVV" maxLength="3" type="password" value={pay.cvv} onChange={e => setPay({ ...pay, cvv: e.target.value })} /> {/* CVV */}
        </div>
      </div>
    )}
  </div>
);

// --- MAIN COMPONENT ---
export default function Cart() { // Export Main
  const navigate = useNavigate(); // Nav hook
  const { cart, addToCart, removeFromCart, updateCartQuantity, placeOrder, currentUser } = useApp(); // Global state

  // Local State
  const [delMode, setDelMode] = useState('online'); // Delivery mode
  const [storeId, setStoreId] = useState(null); // Selected store
  const [addr, setAddr] = useState({ name: currentUser?.name || '', line1: '', city: '', state: '', pincode: '' }); // Address data
  const [pay, setPay] = useState({ method: 'card', nameOnCard: '', cardNumber: '', expiry: '', cvv: '' }); // Payment data
  const [status, setStatus] = useState(null); // Loading/Error status
  const [showUpi, setShowUpi] = useState(false); // Modal toggle
  const [success, setSuccess] = useState(false); // Success toggle
  const [totals, setTotals] = useState({ sub: 0, tax: 0, ship: 0, total: 0 }); // Price math

  // Calculations Effect
  useEffect(() => { // Trigger on change
    const sub = cart.reduce((a, i) => a + (i.price * i.quantity), 0); // Sum items
    const ship = delMode === 'online' ? (sub > 500 ? 0 : 50) : 0; // Calc shipping
    setTotals({ sub, tax: sub * 0.1, ship, total: sub + (sub * 0.1) + ship }); // Update totals
  }, [cart, delMode]); // Deps

  // Format INR currency
  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v); // Formatter

  // Handle Checkout Click
  const handleCheckout = () => { // Function start
    if (delMode === 'online' && (!addr.name || !addr.line1 || !addr.pincode)) return setStatus({ type: 'error', text: 'Fill address.' }); // Validate Addr
    if (delMode === 'store' && !storeId) return setStatus({ type: 'error', text: 'Select store.' }); // Validate Store
    pay.method === 'upi' ? setShowUpi(true) : process(null); // Show UPI or Process
  };

  // Simulate API Process
  const process = (app) => { // Function start
    setStatus({ type: 'loading', text: app ? `Open ${app}...` : 'Processing...' }); // Set loading
    setShowUpi(false); // Close modal
    setTimeout(() => { // Fake delay
      placeOrder && placeOrder({ total: totals.total, method: delMode, addr: delMode === 'online' ? addr : storeId, pay: pay.method, items: cart }); // Save order
      setStatus(null); setSuccess(true); // Set success
    }, 1500); // 1.5s delay
  };

  // Success View
  if (success) return ( // Render success
    <div className="cart-container success-view"> {/* Container */}
      <div className="success-card fade-in"> {/* Card */}
        <div className="success-icon-container"><CheckCircle size={64} color="#10b981" /></div> {/* Icon */}
        <h2>{pay.method === 'cod' ? 'Order Placed!' : 'Payment Confirmed!'}</h2> {/* Heading */}
        <p>{delMode === 'store' ? "Ready for pickup." : "Delivery soon."}</p> {/* Message */}
        <button className="primary-btn" onClick={() => navigate('/')}>Continue Shopping</button> {/* Home Btn */}
      </div>
    </div>
  );

  // Main View
  return (
    <div className="cart-container"> {/* Main wrapper */}
      <header className="cart-header"> {/* Header */}
        <button onClick={() => navigate(-1)} className="back-btn"><ArrowLeft size={20} /><span>Back</span></button> {/* Back Btn */}
        <h1>Checkout</h1> {/* Title */}
      </header>
      <div className="cart-layout"> {/* Grid Layout */}
        <div className="cart-main"> {/* Left Column */}
          <DeliveryModeSelector mode={delMode} setMode={setDelMode} /> {/* Component 1 */}
          {delMode === 'online' ? <AddressForm addr={addr} setAddr={setAddr} /> : <StoreSelector selId={storeId} setSelId={setStoreId} />} {/* Component 2/3 */}
          <PaymentForm pay={pay} setPay={setPay} /> {/* Component 4 */}
        </div>
        <aside className="cart-sidebar"> {/* Right Column */}
          <div className="cart-card summary-card sticky"> {/* Sticky Card */}
            <h3 className="card-title">Order Summary</h3> {/* Title */}
            {!cart.length ? ( // Empty check
              <div className="empty-state"><p>Cart empty.</p><button className="text-btn" onClick={() => navigate('/')}>Shop Now</button></div> // Empty View
            ) : ( // Cart Items
              <div className="order-items"> {/* Items List */}
                {cart.map(i => ( // Loop Items
                  <div key={i.id} className="summary-item"> {/* Item Row */}
                    <div className="item-info"> {/* Info block */}
                      <span className="item-name">{i.name}</span> {/* Name */}
                      <div className="quantity-controls" onClick={e => e.stopPropagation()}> {/* Controls */}
                        <button className="qty-btn" onClick={() => i.quantity - 1 <= 0 ? removeFromCart(i.id) : updateCartQuantity(i.id, i.quantity - 1)}><Minus size={16} /></button> {/* Minus */}
                        <span className="qty-count">{i.quantity}</span> {/* Count */}
                        <button className="qty-btn" disabled={i.quantity >= (i.stock || 99)} onClick={() => addToCart(i)}><Plus size={16} /></button> {/* Plus */}
                      </div>
                    </div>
                    <div className="item-actions"> {/* Actions */}
                      <span className="item-price">{fmt(i.price * i.quantity)}</span> {/* Price */}
                      <button className="btn-icon-danger" onClick={() => removeFromCart(i.id)}><Trash2 size={16} /></button> {/* Remove */}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="divider"></div> {/* Divider */}
            <div className="totals"> {/* Math block */}
              {[['Subtotal', totals.sub], ['Tax (10%)', totals.tax]].map(([l, v]) => <div key={l} className="row"><span>{l}</span><span>{fmt(v)}</span></div>)} {/* Rows */}
              <div className="row"><span>Shipping</span><span className={!totals.ship ? 'text-success' : ''}>{!totals.ship ? 'Free' : fmt(totals.ship)}</span></div> {/* Ship */}
              <div className="row total"><span>Total</span><span>{fmt(totals.total)}</span></div> {/* Total */}
            </div>
            <button className="primary-btn checkout-btn" onClick={handleCheckout} disabled={!cart.length}>{pay.method === 'cod' ? 'Place Order' : 'Confirm Payment'}</button> {/* Action Btn */}
            {status && <div className={`status-badge ${status.type}`}>{status.text}</div>} {/* Status Toast */}
          </div>
        </aside>
      </div>
      {showUpi && ( // UPI Modal
        <div className="modal-backdrop" onClick={() => setShowUpi(false)}> {/* Backdrop */}
          <div className="modal-content" onClick={e => e.stopPropagation()}> {/* Content */}
            <h3>Select UPI App</h3> {/* Title */}
            <div className="upi-grid"> {/* Grid */}
              {[{n:'Google Pay',i:gpay},{n:'PhonePe',i:phonepe},{n:'Paytm',i:paytm},{n:'BHIM',i:bhim}].map(a => ( // Apps Loop
                <button key={a.n} className="upi-item" onClick={() => process(a.n)}><img src={a.i} alt={a.n} /><span>{a.n}</span></button> // App Btn
              ))}
            </div>
            <button className="text-btn" onClick={() => setShowUpi(false)}>Cancel</button> {/* Close */}
          </div>
        </div>
      )}
    </div>
  );
}
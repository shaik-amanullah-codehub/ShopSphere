// --- IMPORTS ---
import React, { useState, useEffect } from 'react'; // Import React core, 'useState' for managing local variables, 'useEffect' for side effects like calculations.
import { useNavigate } from 'react-router-dom';     // Import hook to navigate between pages (e.g., go back or go to home).
import { useApp } from '../../context/AppContext';  // Import custom hook to access global state (Cart data, User data) from the Context API.
import { Trash2, ArrowLeft, CheckCircle, Truck, Store, MapPin } from 'lucide-react'; // Import specific icons for UI elements (Trash bin, Arrows, etc.).
import './Cart.css';                                // Import the CSS file to style this specific component.

// --- CONSTANTS & MOCK DATA ---
// Define image URLs for payment logos to be used in the UI later.
const gpayIcon = "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg";
const phonepeIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png";
const paytmIcon = "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg";
const bhimIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png";

// Mock data array simulating a database response for nearby physical store locations.
const NEARBY_STORES = [
  { id: 1, name: 'TechHaven Downtown', address: '12, MG Road, Central District, Mumbai - 400001', distance: '1.2 km' },
  { id: 2, name: 'TechHaven West', address: 'Shop 45, Infinity Mall, Andheri West, Mumbai - 400053', distance: '5.8 km' },
  { id: 3, name: 'TechHaven Express', address: 'Plot 88, Phoenix Marketcity, Kurla, Mumbai - 400070', distance: '8.4 km' },
];

// --- SUB-COMPONENTS ---

// Component 1: DeliveryModeSelector
// Receives 'mode' (current state) and 'setMode' (updater function) as props to toggle between Online/Store pickup.
const DeliveryModeSelector = ({ mode, setMode }) => (
  <div className="cart-card fade-in">                 {/* Container with a fade-in animation class */}
    <h3 className="card-title">Select Delivery Mode</h3>
    <div className="mode-grid">                       {/* CSS Grid container to layout the two options side-by-side */}
      
      {/* Option 1: Online Delivery */}
      <div 
        className={`mode-card ${mode === 'online' ? 'selected' : ''}`} // Conditional class: adds 'selected' styling if mode is 'online'.
        onClick={() => setMode('online')}             // On click, update parent state to 'online'.
      >
        <div className="mode-icon"><Truck size={24} /></div> {/* Render Truck icon */}
        <div className="mode-info">
          <span className="mode-title">Online Delivery</span>
          <span className="mode-desc">Delivered to your doorstep</span>
        </div>
        <div className="radio-circle"></div>          {/* Visual indicator looking like a radio button */}
      </div>

      {/* Option 2: Store Pickup */}
      <div 
        className={`mode-card ${mode === 'store' ? 'selected' : ''}`} // Conditional class: adds 'selected' styling if mode is 'store'.
        onClick={() => setMode('store')}              // On click, update parent state to 'store'.
      >
        <div className="mode-icon"><Store size={24} /></div> {/* Render Store icon */}
        <div className="mode-info">
          <span className="mode-title">Visit Store</span>
          <span className="mode-desc">Pick up from nearby shop</span>
        </div>
        <div className="radio-circle"></div>
      </div>
    </div>
  </div>
);

// Component 2: StorePickupSelector
// Used when user selects "Visit Store". Receives selected ID and setter function.
const StorePickupSelector = ({ selectedStore, setSelectedStore }) => (
  <div className="cart-card fade-in">
    <h3 className="card-title">Select Store for Pickup</h3>
    <div className="store-list">
      {NEARBY_STORES.map(store => (                   // Loop through the mock store data to create a list item for each.
        <div 
          key={store.id}                              // React needs a unique key for list performance.
          className={`store-item ${selectedStore === store.id ? 'active' : ''}`} // Add 'active' class if this store is the one currently selected.
          onClick={() => setSelectedStore(store.id)}  // Update state with this specific store's ID when clicked.
        >
          <div className="store-icon"><MapPin size={20} /></div> {/* Location pin icon */}
          <div className="store-details">
            <span className="store-name">{store.name}</span>
            <span className="store-address">{store.address}</span>
            <span className="store-distance">{store.distance} away</span>
          </div>
          <div className="radio-circle-small"></div>
        </div>
      ))}
    </div>
  </div>
);

// Component 3: AddressForm
// Used when user selects "Online Delivery". Binds inputs to the 'address' state object.
const AddressForm = ({ address, setAddress }) => (
  <div className="cart-card fade-in">
    <h3 className="card-title">Shipping Address</h3>
    <div className="form-grid">
      <input 
        className="form-input" 
        placeholder="Full Name" 
        value={address.name}                          // Controlled input: value comes from state.
        onChange={e => setAddress({ ...address, name: e.target.value })} // Update only the 'name' property, keep other address fields intact using spread syntax (...).
      />
      <input 
        className="form-input" 
        placeholder="Address Line 1" 
        value={address.line1} 
        onChange={e => setAddress({ ...address, line1: e.target.value })} // Update 'line1' property.
      />
      <div className="form-row">                      {/* container to show City and State on the same line */}
        <input 
          className="form-input" 
          placeholder="City" 
          value={address.city} 
          onChange={e => setAddress({ ...address, city: e.target.value })} 
        />
        <input 
          className="form-input" 
          placeholder="State" 
          value={address.state} 
          onChange={e => setAddress({ ...address, state: e.target.value })} 
        />
      </div>
      <input 
        className="form-input" 
        placeholder="PIN Code" 
        value={address.pincode} 
        onChange={e => setAddress({ ...address, pincode: e.target.value })} 
      />
    </div>
  </div>
);

// Component 4: PaymentForm
// Handles payment method selection and Card input fields.
const PaymentForm = ({ payment, setPayment }) => (
  <div className="cart-card fade-in" style={{ animationDelay: '0.1s' }}> {/* Stagger animation slightly for visual effect */}
    <h3 className="card-title">Payment Method</h3>
    <div className="payment-options">
      {['card', 'upi', 'cod'].map(method => (         // Loop through available payment strings to generate buttons dynamically.
        <button 
          key={method}
          type="button" 
          className={`payment-btn ${payment.method === method ? 'active' : ''}`} // Highlight the currently selected button.
          onClick={() => setPayment({ ...payment, method: method })} // Switch payment method in state.
        >
          {method.toUpperCase()}                      {/* Display method in Uppercase (CARD, UPI, COD) */}
        </button>
      ))}
    </div>

    {/* Conditional Rendering: Only show Credit Card inputs if 'card' is selected */}
    {payment.method === 'card' && (
      <div className="card-details slide-down">       {/* Slide down animation wrapper */}
        <input 
          className="form-input" 
          placeholder="Name on Card" 
          value={payment.nameOnCard} 
          onChange={e => setPayment({ ...payment, nameOnCard: e.target.value })} 
        />
        <input 
          className="form-input" 
          placeholder="Card Number" 
          maxLength="16"                              // Limit input length for standard card numbers.
          value={payment.cardNumber} 
          onChange={e => setPayment({ ...payment, cardNumber: e.target.value })} 
        />
        <div className="form-row">
          <input 
            className="form-input" 
            placeholder="MM/YY" 
            maxLength="5"
            value={payment.expiry} 
            onChange={e => setPayment({ ...payment, expiry: e.target.value })} 
          />
          <input 
            className="form-input" 
            placeholder="CVV" 
            maxLength="3"
            type="password"                           // Mask characters for security (dots instead of text).
            value={payment.cvv} 
            onChange={e => setPayment({ ...payment, cvv: e.target.value })} 
          />
        </div>
      </div>
    )}
  </div>
);

// --- MAIN COMPONENT ---

export default function Cart() {
  const navigate = useNavigate();                     // Hook to move user to different pages.
  const { cart, removeFromCart, placeOrder, currentUser } = useApp(); // Destructure global state: getting cart items and functions from AppContext.

  // --- STATE DECLARATIONS ---
  const [deliveryMethod, setDeliveryMethod] = useState('online'); // Tracks if user wants 'online' or 'store'.
  const [selectedStoreId, setSelectedStoreId] = useState(null);   // Tracks which store ID is selected (if in store mode).
  
  // State for address form. Pre-fills 'name' if a currentUser exists in context.
  const [address, setAddress] = useState({ 
    name: currentUser?.name || '', 
    line1: '', 
    city: '', 
    state: '', 
    pincode: '' 
  });
  
  // State for payment details.
  const [payment, setPayment] = useState({ method: 'card', nameOnCard: '', cardNumber: '', expiry: '', cvv: '' });
  
  const [status, setStatus] = useState(null);         // Tracks UI status: 'loading', 'error', or null.
  const [showUpiSelector, setShowUpiSelector] = useState(false); // Controls visibility of the UPI Modal.
  const [orderSuccess, setOrderSuccess] = useState(false); // Flag to switch view to "Thank You" screen upon completion.
  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 }); // Stores calculated prices.

  // Mock UPI Apps Data
  const UPI_APPS = [
    { id: 'gpay', name: 'Google Pay', icon: gpayIcon },
    { id: 'phonepe', name: 'PhonePe', icon: phonepeIcon },
    { id: 'paytm', name: 'Paytm', icon: paytmIcon },
    { id: 'bhim', name: 'BHIM', icon: bhimIcon }
  ];

  // Helper function to format numbers into Indian Currency (e.g., ₹1,200.00).
  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  // --- EFFECT: CALCULATE TOTALS ---
  useEffect(() => {
    // 1. Calculate Subtotal: (Price * Quantity) for all items in cart.
    const sub = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // 2. Calculate Tax: 10% of subtotal.
    const tax = sub * 0.10;
    
    // 3. Calculate Shipping Logic: 
    let shipping = 0;
    if (deliveryMethod === 'online') {
        shipping = sub > 500 ? 0 : 50;                // Free shipping if order > 500, else 50.
    }
    // If deliveryMethod is 'store', shipping remains 0.

    // Update state with calculated values.
    setTotals({ subtotal: sub, tax, shipping, total: sub + tax + shipping });
  }, [cart, deliveryMethod]);                         // Dependency Array: Re-run this logic whenever 'cart' or 'deliveryMethod' changes.

  // --- HANDLER: VALIDATE & START PAYMENT ---
  const handleConfirmPayment = () => {
    // 1. Validation for Online Delivery
    if (deliveryMethod === 'online') {
      if (!address.name || !address.line1 || !address.pincode) {
        setStatus({ type: 'error', text: 'Please fill in the shipping address.' }); // Show error if fields empty.
        return;                                       // Stop execution.
      }
    } else {
      // 1. Validation for Store Pickup
      if (!selectedStoreId) {
        setStatus({ type: 'error', text: 'Please select a store for pickup.' }); // Show error if no store selected.
        return;
      }
    }

    // 2. Check Payment Type
    if (payment.method === 'upi') {
      setShowUpiSelector(true);                       // If UPI, open the Modal instead of finishing immediately.
      return;
    }

    // 3. If valid and not UPI, process order.
    processOrder();
  };

  // --- HANDLER: SIMULATE API CALL ---
  const processOrder = (viaApp = null) => {
    const msg = viaApp ? `Processing via ${viaApp}...` : 'Processing payment...'; // Set loading text.
    setStatus({ type: 'loading', text: msg });        // Show loading badge.
    setShowUpiSelector(false);                        // Close modal if open.

    // Simulate network delay (1.5 seconds)
    setTimeout(() => {
      // Construct final order object to save/send to backend.
      const orderDetails = {
        total: totals.total,
        deliveryMethod,
        shippingAddress: deliveryMethod === 'online' ? address : NEARBY_STORES.find(s => s.id === selectedStoreId),
        paymentMethod: payment.method,
        items: cart
      };

      if (placeOrder) placeOrder(orderDetails);       // Call the context function to empty cart/save order.
      
      setStatus(null);                                // Remove loading badge.
      setOrderSuccess(true);                          // Trigger Success View render.
    }, 1500);
  };

  // Helper component to handle broken images safely.
  const SafeImage = ({ src, alt, fallbackText }) => {
    const [hasError, setHasError] = useState(false);  // Track if image failed to load.
    if (hasError) return <div className="icon-fallback">{fallbackText}</div>; // Show text if error.
    return <img src={src} alt={alt} onError={() => setHasError(true)} />; // Set error flag on load failure.
  };

  // --- RENDER: SUCCESS VIEW ---
  if (orderSuccess) {
    return (
      <div className="cart-container success-view">
        <div className="success-card fade-in">
          <div className="success-icon-container"><CheckCircle size={64} color="#10b981" /></div>
          <h2>{payment.method === 'cod' ? 'Order Placed!' : 'Payment Confirmed!'}</h2>
          <p>
            {/* Show different message based on delivery method */}
            {deliveryMethod === 'store' 
              ? "Your order is ready. Please visit the selected store for pickup." 
              : "Your order has been placed and will be delivered soon."}
          </p>
          <button className="primary-btn" onClick={() => navigate('/')}>Continue Shopping</button> {/* Go to Home */}
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN CHECKOUT VIEW ---
  return (
    <div className="cart-container">
      <header className="cart-header">
        <button onClick={() => navigate(-1)} className="back-btn"> {/* Navigate back in history */}
            <ArrowLeft size={20} /><span>Back</span>
        </button>
        <h1>Checkout</h1>
      </header>

      <div className="cart-layout">                   {/* Grid layout for Main Content + Sidebar */}
        <div className="cart-main">
          
          {/* 1. Render Delivery Mode Selector */}
          <DeliveryModeSelector mode={deliveryMethod} setMode={setDeliveryMethod} />

          {/* 2. Conditionally Render Address Form OR Store Selector based on mode */}
          {deliveryMethod === 'online' ? (
            <AddressForm address={address} setAddress={setAddress} />
          ) : (
            <StorePickupSelector selectedStore={selectedStoreId} setSelectedStore={setSelectedStoreId} />
          )}

          {/* 3. Render Payment Form */}
          <PaymentForm payment={payment} setPayment={setPayment} />
        
        </div>

        {/* SIDEBAR: ORDER SUMMARY */}
        <aside className="cart-sidebar">
          <div className="cart-card summary-card sticky"> {/* 'Sticky' keeps it visible while scrolling */}
            <h3 className="card-title">Order Summary</h3>
            
            {/* Check if cart is empty */}
            {cart.length === 0 ? (
              <div className="empty-state">
                <p>Your cart is empty.</p>
                <button className="text-btn" onClick={() => navigate('/')}>Shop Now</button>
              </div>
            ) : (
              <div className="order-items">
                {/* Map through cart items to display them */}
                {cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <div className="qty-controls"><span className="text-muted">Qty: {item.quantity}</span></div>
                    </div>
                    <div className="item-actions">
                        <span className="item-price">{formatCurrency(item.price * item.quantity)}</span>
                        {/* Button to remove item from global cart state */}
                        <button className="btn-icon-danger" onClick={() => removeFromCart(item.id)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="divider"></div>
            
            {/* TOTALS SECTION */}
            <div className="totals">
              <div className="row">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="row">
                <span>Tax (10%)</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
              <div className="row">
                <span>Shipping ({deliveryMethod === 'store' ? 'Pickup' : 'Delivery'})</span>
                {/* Conditionally style text if free shipping */}
                <span className={totals.shipping === 0 ? 'text-success' : ''}>
                    {totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}
                </span>
              </div>
              <div className="row total">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <button 
              className="primary-btn checkout-btn"
              onClick={handleConfirmPayment}          // Trigger validation/payment logic.
              disabled={cart.length === 0}            // Disable button if cart is empty.
            >
              {/* Dynamic button text based on payment method */}
              {payment.method === 'cod' ? 'Place Order' : 'Confirm Payment'}
            </button>
            
            {/* Status Badge: Shows error or loading messages */}
            {status && <div className={`status-badge ${status.type}`}>{status.text}</div>}
          </div>
        </aside>
      </div>

      {/* UPI MODAL: Only shows if 'showUpiSelector' is true */}
      {showUpiSelector && (
        <div className="modal-backdrop" onClick={() => setShowUpiSelector(false)}> {/* Close modal if clicking background */}
          <div className="modal-content" onClick={e => e.stopPropagation()}>       {/* Prevent click inside modal from closing it */}
            <h3>Select UPI App</h3>
            <div className="upi-grid">
              {UPI_APPS.map(app => (
                <button key={app.id} className="upi-item" onClick={() => processOrder(app.name)}>
                  <SafeImage src={app.icon} alt={app.name} fallbackText={app.name[0]} />
                  <span>{app.name}</span>
                </button>
              ))}
            </div>
            <button className="text-btn" onClick={() => setShowUpiSelector(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
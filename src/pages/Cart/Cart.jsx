import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useApp } from '../../context/AppContext'; 
import { Trash2, ArrowLeft, CheckCircle, Truck, Store, MapPin, Plus, Minus } from 'lucide-react'; 
import './Cart.css'; 

// --- CONSTANTS ---
const PAYMENT_LOGOS = {
  gpay: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg",
  phonepe: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg",
  paytm: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg",
  bhim: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
};

const STORES = [
  { id: 1, name: 'ShopSphere Downtown', address: '12, MG Road, Mumbai - 400001', dist: '1.2 km' }, 
  { id: 2, name: 'ShopSphere West', address: 'Shop 45, Andheri West, Mumbai - 400053', dist: '5.8 km' }, 
  { id: 3, name: 'ShopSphere Express', address: 'Phoenix Marketcity, Mumbai - 400070', dist: '8.4 km' }, 
];

// --- SUB-COMPONENTS (Preserving Teammate's UI) ---

const DeliveryModeSelector = ({ mode, setMode }) => (
  <div className="cart-card fade-in">
    <h3 className="card-title">Select Delivery Mode</h3>
    <div className="mode-grid">
      {[{ id: 'online', Icon: Truck, t1: 'Online Delivery -', t2: 'Delivered to your doorstep' },
        { id: 'store', Icon: Store, t1: 'Visit Store -', t2: 'Pick up from nearby shop' }
      ].map(({ id, Icon, t1, t2 }) => (
        <div key={id} className={`mode-card ${mode === id ? 'selected' : ''}`} onClick={() => setMode(id)}>
          <div className="mode-icon"><Icon size={24} /></div>
          <div className="mode-info"><span className="mode-title">{t1}</span><span className="mode-desc">{t2}</span></div>
          <div className="radio-circle"></div>
        </div>
      ))}
    </div>
  </div>
);

const StoreSelector = ({ selId, setSelId }) => (
  <div className="cart-card fade-in">
    <h3 className="card-title">Select Store for Pickup</h3>
    <div className="store-list">
      {STORES.map(s => (
        <div key={s.id} className={`store-item ${selId === s.id ? 'active' : ''}`} onClick={() => setSelId(s.id)}>
          <div className="store-icon"><MapPin size={20} /></div>
          <div className="store-details">
            <span className="store-name">{s.name}</span>
            <span className="store-address">{s.address}</span>
            <span className="store-distance">{s.dist} away</span>
          </div>
          <div className="radio-circle-small"></div>
        </div>
      ))}
    </div>
  </div>
);

const AddressForm = ({ addr, setAddr }) => (
  <div className="cart-card fade-in">
    <h3 className="card-title">Shipping Address</h3>
    <div className="form-grid">
      <input className="form-input" placeholder="Full Name" value={addr.name} onChange={e => setAddr({ ...addr, name: e.target.value })} />
      <input className="form-input" placeholder="Address Line 1" value={addr.line1} onChange={e => setAddr({ ...addr, line1: e.target.value })} />
      <div className="form-row">
        <input className="form-input" placeholder="City" value={addr.city} onChange={e => setAddr({ ...addr, city: e.target.value })} />
        <input className="form-input" placeholder="State" value={addr.state} onChange={e => setAddr({ ...addr, state: e.target.value })} />
      </div>
      <input className="form-input" placeholder="PIN Code" value={addr.pincode} onChange={e => setAddr({ ...addr, pincode: e.target.value })} />
    </div>
  </div>
);

const PaymentForm = ({ pay, setPay }) => (
  <div className="cart-card fade-in">
    <h3 className="card-title">Payment Method</h3>
    <div className="payment-options">
      {['card', 'upi', 'cod'].map(m => (
        <button key={m} type="button" className={`payment-btn ${pay.method === m ? 'active' : ''}`} onClick={() => setPay({ ...pay, method: m })}>{m.toUpperCase()}</button>
      ))}
    </div>
    {pay.method === 'card' && (
      <div className="card-details slide-down mt-3">
        <input className="form-input mb-2" placeholder="Name on Card" value={pay.nameOnCard} onChange={e => setPay({ ...pay, nameOnCard: e.target.value })} />
        <input className="form-input mb-2" placeholder="Card Number" maxLength="16" value={pay.cardNumber} onChange={e => setPay({ ...pay, cardNumber: e.target.value })} />
        <div className="form-row">
          <input className="form-input" placeholder="MM/YY" maxLength="5" value={pay.expiry} onChange={e => setPay({ ...pay, expiry: e.target.value })} />
          <input className="form-input" placeholder="CVV" maxLength="3" type="password" value={pay.cvv} onChange={e => setPay({ ...pay, cvv: e.target.value })} />
        </div>
      </div>
    )}
  </div>
);

// --- MAIN COMPONENT ---
export default function Cart() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateCartQuantity, placeOrder, currentUser } = useApp();

  const [delMode, setDelMode] = useState('online');
  const [storeId, setStoreId] = useState(null);
  const [addr, setAddr] = useState({ name: currentUser?.name || '', line1: '', city: '', state: '', pincode: '' });
  const [pay, setPay] = useState({ method: 'card', nameOnCard: '', cardNumber: '', expiry: '', cvv: '' });
  const [status, setStatus] = useState(null);
  const [showUpi, setShowUpi] = useState(false);
  const [success, setSuccess] = useState(false);
  const [totals, setTotals] = useState({ sub: 0, tax: 0, ship: 0, total: 0 });

  useEffect(() => {
    const sub = cart.reduce((a, i) => a + (i.price * i.quantity), 0);
    const ship = delMode === 'online' ? (sub > 500 ? 0 : 50) : 0;
    const tax = sub * 0.08; 
    setTotals({ sub, tax, ship, total: sub + tax + ship });
  }, [cart, delMode]);

  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v);

  const handleCheckout = () => {
    if (delMode === 'online' && (!addr.name || !addr.line1 || !addr.pincode)) {
        return setStatus({ type: 'error', text: 'Please fill shipping details.' });
    }
    if (delMode === 'store' && !storeId) {
        return setStatus({ type: 'error', text: 'Please select a store.' });
    }
    pay.method === 'upi' ? setShowUpi(true) : process(null);
  };

  // --- FIXED DATA PROCESSING ---
  const process = (app) => {
    setStatus({ type: 'loading', text: app ? `Opening ${app}...` : 'Processing...' });
    setShowUpi(false);
    
    // Find store data if pickup is selected
    const selectedStore = STORES.find(s => s.id === storeId);

    // FIX: Structure the payload exactly as the Context and Admin Page expect
    const finalOrderPayload = {
      total: totals.total,
      inStorePickup: delMode === 'store',
      shippingAddress: {
        fullName: addr.name || currentUser?.name || 'Customer',
        address: delMode === 'online' ? addr.line1 : selectedStore?.address,
        city: delMode === 'online' ? addr.city : 'Mumbai',
        state: delMode === 'online' ? addr.state : 'Maharashtra',
        zipCode: delMode === 'online' ? addr.pincode : '000000',
        email: currentUser?.email || 'N/A',
        phone: 'N/A'
      },
      paymentMethod: pay.method,
      items: cart
    };

    setTimeout(async () => {
      try {
        await placeOrder(finalOrderPayload);
        setStatus(null); 
        setSuccess(true);
      } catch (err) {
        setStatus({ type: 'error', text: 'Checkout failed.' });
      }
    }, 1500);
  };

  if (success) return (
    <div className="cart-container success-view">
      <div className="success-card fade-in text-center p-5 shadow">
        <div className="mb-4"><CheckCircle size={64} color="#10b981" /></div>
        <h2 className="fw-bold">Order Confirmed!</h2>
        <p className="text-muted">Thank you for shopping. You can track your order in your profile.</p>
        <button className="btn btn-primary btn-lg mt-3 px-5" onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div className="cart-container container py-4">
      <header className="cart-header d-flex align-items-center mb-4">
        <button onClick={() => navigate(-1)} className="back-btn btn p-0 me-3"><ArrowLeft size={24} /></button>
        <h1 className="h3 fw-bold mb-0">Checkout</h1>
      </header>

      <div className="row g-4">
        <div className="col-lg-8">
          <DeliveryModeSelector mode={delMode} setMode={setDelMode} />
          {delMode === 'online' ? <AddressForm addr={addr} setAddr={setAddr} /> : <StoreSelector selId={storeId} setSelId={setStoreId} />}
          <PaymentForm pay={pay} setPay={setPay} />
        </div>

        <aside className="col-lg-4">
          <div className="cart-card summary-card sticky-top" style={{ top: '20px' }}>
            <h3 className="card-title h5 fw-bold mb-3">Order Summary</h3>
            {!cart.length ? (
              <div className="text-center py-4"><p>Cart empty.</p></div>
            ) : (
              <div className="order-items mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {cart.map(i => (
                  <div key={i.id} className="summary-item d-flex justify-content-between mb-3 border-bottom pb-2">
                    <div className="item-info">
                      <span className="d-block fw-bold small">{i.name}</span>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <button className="btn btn-sm btn-outline-secondary p-0 px-1" onClick={() => updateCartQuantity(i.id, i.quantity - 1)}><Minus size={12}/></button>
                        <span className="small">{i.quantity}</span>
                        <button className="btn btn-sm btn-outline-secondary p-0 px-1" onClick={() => addToCart(i)}><Plus size={12}/></button>
                      </div>
                    </div>
                    <div className="item-actions text-end">
                      <span className="d-block small fw-bold">{fmt(i.price * i.quantity)}</span>
                      <button className="btn btn-link text-danger p-0" onClick={() => removeFromCart(i.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="totals border-top pt-3">
              <div className="d-flex justify-content-between mb-1"><span>Subtotal</span><span>{fmt(totals.sub)}</span></div>
              <div className="d-flex justify-content-between mb-1"><span>Tax (8%)</span><span>{fmt(totals.tax)}</span></div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className={totals.ship === 0 ? 'text-success' : ''}>{totals.ship === 0 ? 'Free' : fmt(totals.ship)}</span>
              </div>
              <div className="d-flex justify-content-between h5 fw-bold border-top pt-2">
                <span>Total</span>
                <span className="text-primary">{fmt(totals.total)}</span>
              </div>
            </div>
            <button className="btn btn-primary w-100 mt-3 btn-lg fw-bold" onClick={handleCheckout} disabled={!cart.length}>
              {pay.method === 'cod' ? 'Place Order' : 'Confirm Payment'}
            </button>
            {status && <div className={`alert mt-3 py-2 small alert-${status.type === 'error' ? 'danger' : 'info'}`}>{status.text}</div>}
          </div>
        </aside>
      </div>

      {showUpi && (
        <div className="modal-backdrop show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setShowUpi(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content p-4 text-center">
              <h4 className="fw-bold mb-4">Select UPI App</h4>
              <div className="row g-3">
                {[{n:'Google Pay',i:PAYMENT_LOGOS.gpay},{n:'PhonePe',i:PAYMENT_LOGOS.phonepe},{n:'Paytm',i:PAYMENT_LOGOS.paytm},{n:'BHIM',i:PAYMENT_LOGOS.bhim}].map(a => (
                  <div key={a.n} className="col-6">
                    <button className="btn btn-outline-light w-100 p-3 text-dark border d-flex flex-column align-items-center" onClick={() => process(a.n)}>
                      <img src={a.i} alt={a.n} style={{ height: '30px' }} className="mb-2" />
                      <span className="small">{a.n}</span>
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn btn-link mt-3 text-muted" onClick={() => setShowUpi(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
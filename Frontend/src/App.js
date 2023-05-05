
import './App.css';
import Products from './components/Products/Products';
import Navbar from './components/Navbar/Navbar';
import Cart from './components/Cart/Cart';
import Login from './components/Login/Login';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [totalitems, setTotalItems] = useState(0);

    const fetchProducts = async () => {
      const data1 = await fetch('http://localhost:5000/fetch-data');
      console.log(data1);
      const data = await fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => setProducts(data));
      console.log(products);
    }

    const fetchCart = async () => {
      const cart = await fetch('http://localhost:5000/cart')
        .then(res => res.json())
        .then(data => {
          if(data) {
          setCart(data);
          }
          return data;
        })
        .then(data => {
          if (data) { // Check if data is not null before setting totalitems
            setTotalItems(data.totalitems);
          }
        });

    }
    
    const handleAddToCart = async (product) => {
      try {
        const response = await axios.post('http://localhost:5000/AddTocart', { id: product._id, quantity: 1 });
        console.log(response.data);
        fetchCart();
      } catch (error) {
        console.error(error);
      }
    };
    
    const handleUpdateCartQty = async (productId, quantity) => {
      try {
        console.log("Received productId:", productId, "and quantity:", quantity);
        if(quantity === 0) {
          handleRemoveFromCart(productId);
          return;
        }
        const response = await axios.post('http://localhost:5000/Updatecart', { productId, quantity });
        console.log(response.data);
        fetchCart(); // Update the cart state with the new cart data from the server
      } catch (error) {
        console.error(error);
      }
    };
    
    const handleRemoveFromCart = async (productId) => {
      try {
        console.log("Received productId:", productId);
        const response = await axios.delete(`http://localhost:5000/removefromcart/${productId}`);
        console.log(response.data);
        fetchCart();
      } catch (error) {
        console.error(error);
      }
    }

    const handleCheckout = async () => {
      try {
        const response = await axios.post('http://localhost:5000/checkout');
        console.log(response.data);
        setCart({}); // Empty the cart state
        setTotalItems(0); // Reset the totalitems state
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      fetchProducts();
    },[]);

    useEffect(() => {
      fetchCart();
    }, []);

  return (
    <div>
      <Router>
        <Navbar totalItems={totalitems} />
        <Routes>
          <Route exact path="/">
            <Route exact path="/" element={<Products products={products} onAddToCart={handleAddToCart} />} />
          </Route>
          <Route exact path="/cart">
            <Route exact path="/cart" element={<Cart cart={cart}
                                                handleUpdateCartQty={handleUpdateCartQty}
                                                handleRemoveFromCart={handleRemoveFromCart}
                                                handleEmptyCart={handleCheckout}
                                              />
             } />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const Cart = require('../Models/store').Cart;
const Product = require('../Models/store').Product;
const User = require('../Models/store').User;
const Sales = require('../Models/store').Sales;

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));

// Fetching data and storing the data in MongoDB
app.get('/fetch-data', async (req, res) => {
    try {
      console.log('Fetching data from APIs...');
      // Fetch products from API
      const productsResponse = await axios.get('https://fakestoreapi.com/products');
      const products = productsResponse.data;

      // Save products to MongoDB
      await Product.insertMany(products);

      res.send('Data saved to MongoDB');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching data');
    }
  });

  app.get('/', (req, res) => {
    res.send('Hello, Welcome to ecommerce store!');
  });

//-----------------------All Products APIs---------------------------------------------
//get all products
  app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
      console.log(products);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error getting products');
    }
  });


//------------------------------------------------------------------------------


//-----------------------All Cart APIs---------------------------------------------

//get all carts
app.post('/AddTocart', async (req, res) => {
    try {
      console.log('Adding to cart...');
      const productId = req.body.id;
      const quantity = req.body.quantity;
  
      if (!productId || !quantity) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
  
      // check if the cart exists
      let cart = await Cart.findOne({});
      if (!cart) {
        cart = await Cart.create({ products: [] });
      }
  
      // check if the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // check if the product is already in the cart
      const cartProductIndex = cart.products.findIndex((p) => p._id.equals(productId));
  
      if (cartProductIndex > -1) {
        // product is already in the cart, update the quantity
        cart.products[cartProductIndex].quantity += quantity;
      } else {
        // product is not in the cart, add it
        cart.products.push({
          _id: product._id,
          title: product.title,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category,
          quantity: quantity,
        });
      }
  
      // update the subtotal
      cart.subtotal += product.price * quantity;
      cart.totalitems += quantity;
  
      await cart.save();
  
      res.json(cart);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

// get the cart
    app.get('/cart', async (req, res) => {
        try {
            const cart = await Cart.findOne({});
            res.json(cart);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
        }
    });

// update the cart
    app.post('/Updatecart', async (req, res) => {
        try {
            const productId = req.body.productId;
            const quantity = req.body.quantity;
            console.log(productId);
            console.log(quantity);

            // check if the cart exists
            let cart = await Cart.findOne({});
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            // check if the product exists in the cart
            const product = cart.products.find((product) => product.id === productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found in cart' });
            }

            // update the product quantity
            product.quantity = quantity;

            // update the subtotal
            cart.subtotal = cart.products.reduce((total, product) => {
                return total + product.price * product.quantity;
            }, 0);

            // update the total items
            cart.totalitems = cart.products.reduce((total, product) => {
                return total + product.quantity;
            }, 0);

            await cart.save();

            res.json(cart);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
        }
    });

    //removefromcart
    app.delete('/removefromcart/:productId', async (req, res) => {
        try {
          const productId = req.params.productId;
      
          // Check if the cart exists
          let cart = await Cart.findOne({});
          if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
          }
      
          // Find the product index in the cart
          const productIndex = cart.products.findIndex((p) => p._id.equals(productId));
      
          if (productIndex > -1) {
            // Remove the product from the cart
            cart.totalitems -= cart.products[productIndex].quantity;
            cart.subtotal -= cart.products[productIndex].price * cart.products[productIndex].quantity;
            cart.products.splice(productIndex, 1);
      
            await cart.save();
            res.json(cart);
          } else {
            res.status(404).json({ error: 'Product not found in cart' });
          }
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Server error' });
        }
      });

// checkout
    app.post('/checkout', async (req, res) => {
        try {
        // Check if the cart exists
        let cart = await Cart.findOne({});
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
    
        // Create a new sale with the cart data
        const newSale = new Sales({
            products: cart.products,
            subtotal: cart.subtotal,
            totalitems: cart.totalitems,
        });
    
        await newSale.save();
    
        // Delete the cart
        await Cart.deleteOne({});
    
        // Return the new sale data
        res.json(newSale);
        } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
        }
    });
//------------------------------------------------------------------------------

// admin apis

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password';

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// In your server-side code

app.get('/admin/sales', async (req, res) => {
    try {
      const sales = await Sales.find({});
      res.json(sales);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

//exporting app
module.exports = app;
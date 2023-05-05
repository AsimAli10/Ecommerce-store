const mongoose = require('mongoose');
// Connect to MongoDB

// Define schema and model for storing products
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  image: String,
  category: String 
});
const Product = mongoose.model('Product', productSchema);

// Define schema and model for storing shopping carts
const cartSchema = new mongoose.Schema({
  //array of Product objects
  products: [
    {
      title: String,
      price: Number,
      description: String,
      image: String,
      category: String,
      quantity: {
        type: Number,
        default: 0
      }
    }
  ],
  subtotal: {
    type: Number,
    default: 0
  },
  totalitems: {
    type: Number,
    default: 0
  }

});
const Cart = mongoose.model('Cart', cartSchema);

//sales schema
const SalesSchema = new mongoose.Schema({
  products: [
    {
      id: String,
      title: String,
      price: Number,
      quantity: Number,
    },
  ],
  subtotal: Number,
  totalitems: Number,
  date: { type: Date, default: Date.now },
});

const Sales = mongoose.model('Sales', SalesSchema);
// Define schema and model for storing users
const userSchema = new mongoose.Schema({
  id: Number,
  name: {firstname: String, lastname: String},
  email: String,
  phone: String,
  username: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

module.exports = { Product, Cart, User,Sales };

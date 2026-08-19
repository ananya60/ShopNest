const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

// 🔴 Replace <db_username> and <db_password> with your real credentials:
const ATLAS_URI = 'mongodb+srv://ShopNest:ShopNest123456789@cluster0.5blatir.mongodb.net/shopnest?retryWrites=true&w=majority&appName=Cluster0';

const importData = async () => {
  try {
    console.log('Connecting to cloud MongoDB Atlas...');
    const conn = await mongoose.connect(ATLAS_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await User.create({
      name: 'Admin User',
      email: 'admin@shopnest.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Fetching dummy products...');
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data = await response.json();

    const products = data.products.map((p) => ({
      name: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      imageUrl: p.thumbnail,
      ratings: p.rating,
      numReviews: 0,
    }));

    await Product.insertMany(products);

    console.log('Dummy products imported successfully to Atlas cloud!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
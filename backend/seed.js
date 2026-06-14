const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

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

    console.log('Dummy products imported successfully!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);

    await mongoose.connection.close();
    process.exit(1);
  }
};

importData();
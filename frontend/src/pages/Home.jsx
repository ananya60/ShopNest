import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const API_URL = process.env.REACT_APP_API_URL || 'https://shopnest-dsu5.onrender.com';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 4)); // Featured products
        } else if (data.products && Array.isArray(data.products)) {
          setProducts(data.products.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch home products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-banner">
        <h1>Welcome to ShopNest</h1>
        <p>Discover the best products at unbeatable prices.</p>
      </div>
      <h2>Featured Products</h2>
      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <p style={{ color: '#a1a1aa' }}>No featured products available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
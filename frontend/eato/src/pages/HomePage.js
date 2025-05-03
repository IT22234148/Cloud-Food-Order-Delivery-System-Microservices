import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const categories = [
    { label: 'Breakfast', icon: '🍎', path: '/breakfast' },
    { label: 'Cafes', icon: '☕', path: '/cafes' },
    { label: 'Luxury Dining', icon: '🍽️', path: '/luxury' },
    { label: 'Lunch', icon: '🥗', path: '/lunch' },
    { label: 'Drinks and Nightlife', icon: '🍹', path: '/nightlife' },
    { label: 'Pocket-Friendly Meals', icon: '🍔', path: '/budget-meals' },
    { label: 'Payments', icon: '💳', path: '/paymentchoose' },
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
            <style>{`
        .hero {
          background: url('/bannerfood.jpg') no-repeat center center/cover;
          height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }

        .hero-content {
          position: relative;
          color: white;
          text-align: center;
          padding: 2rem;
          z-index: 1;
        }

        .hero-content h1 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .search-box {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-box input {
          padding: 0.8rem 1rem;
          border-radius: 5px;
          border: none;
          font-size: 1rem;
        }

        .search-box button {
          padding: 0.8rem 1.5rem;
          background-color: #FF4F00;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .search-box button:hover {
          background-color: #e96c00;
        }

        .quick-searches {
          padding: 4rem 1rem;
          text-align: center;
        }

        .quick-searches h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .quick-searches p {
          color: gray;
          margin-bottom: 2rem;
        }

        .categories {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .category {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 10px;
          width: 120px;
          text-align: center;
          box-shadow: 0 1px 3px #FF4F00;
          transition: transform 0.2s ease;
        }

        .category:hover {
          transform: translateY(-5px);
        }

        .category .icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>Stay Productive while we prepare your food</h1>
          <div className="search-box">
            <input type="text" placeholder="📍 Location" />
            <input type="text" placeholder="🔍 Search for restaurants or cuisine" />
            <button>Find Food</button>
          </div>
        </div>
      </div>

      {/* Quick Searches */}
      <div className="quick-searches">
        <h2>Quick Searches</h2>
        <p>Explore restaurants by type of meal</p>
        <div className="categories">
          {categories.map((item) => (
            <div
              className="category"
              key={item.label}
              onClick={() => handleCategoryClick(item.path)}
            >
              <div className="icon">{item.icon}</div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

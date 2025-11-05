import React, { useState, useEffect, useRef } from "react";
import "@google/model-viewer";
import menuData from "../data/menuData.json";
import languages from "../data/languages.json";

export default function Menu() {
  const [language, setLanguage] = useState("en");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [dietFilter, setDietFilter] = useState("All");
  const [modalItem, setModalItem] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cardRefs = useRef([]);

  const t = languages[language];

  // Use the provided menuData and ensure veg/non-veg properties exist
  const enhancedMenuData = menuData.map((item, index) => ({
    ...item,
    // Ensure veg property exists, default to true for non-burger items
    veg: item.veg !== undefined ? item.veg : !item.category.includes('Burger') && !item.name.toLowerCase().includes('burger'),
    featured: index % 5 === 0 // Mark every 5th item as featured
  }));

  // Filter items based on search, category, and diet type
  const filteredItems = enhancedMenuData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeTab === "All" || item.category === activeTab;
    const matchesDiet = dietFilter === "All" || 
                       (dietFilter === "Veg" && item.veg === true) ||
                       (dietFilter === "Non-Veg" && item.veg === false) ||
                       (dietFilter === "Vegan" && item.vegan === true);

    return matchesSearch && matchesCategory && matchesDiet;
  });

  // Get unique categories for tabs
  const categories = ["All", ...new Set(menuData.map(item => item.category))];

  // Scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [filteredItems]);

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setIsLoading(true);
    setLanguage(newLanguage);
    setTimeout(() => setIsLoading(false), 300);
  };

  const clearAllFilters = () => {
    setSearch("");
    setActiveTab("All");
    setDietFilter("All");
  };

  return (
    <div className={`menu-container ${isLoading ? "fade-out" : "fade-in"}`}>
      {/* 🌐 Language Selector */}
      <div className="lang-select-wrapper">
        <div className="lang-select">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="lang-dropdown"
          >
            {Object.entries(languages).map(([code, data]) => (
              <option key={code} value={code}>
                {data.languageName}
              </option>
            ))}
          </select>
          <div className="lang-icon">🌐</div>
        </div>
      </div>

      {/* 🏆 Premium Header */}
      <div className="premium-header">
        <div className="restaurant-brand">
          <div className="brand-main">
            <h1 className="restaurant-name">ÉCLAT ROYALE</h1>
            <div className="restaurant-tagline">Culinary Excellence Since 1995</div>
          </div>
          <div className="star-display">
            <div className="stars">{"★".repeat(7)}</div>
            <div className="michelin-text">Michelin Guide</div>
          </div>
        </div>
        
        <div className="header-content">
          <h2 className="menu-title">{t.title || "Premium Menu"}</h2>
          <p className="menu-subtitle">Experience the Art of Fine Dining</p>
        </div>
      </div>

      {/* 🔍 Search Section */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder={t.searchPlaceholder || "Search menu items..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="btn-reset" onClick={clearAllFilters}>
            {t.reset || "Clear All"}
          </button>
        </div>
      </div>

      {/* 🗂 Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          {/* Category Tabs */}
          <div className="filter-group">
            <label className="filter-label">Categories</label>
            <div className="tabs-scroll">
              {categories.map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  <span className="tab-underline"></span>
                </button>
              ))}
            </div>
          </div>

          {/* Diet Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Diet Type</label>
            <div className="diet-filters">
              {["All", "Veg", "Non-Veg", "Vegan"].map((diet) => (
                <button
                  key={diet}
                  className={`diet-filter ${dietFilter === diet ? "active" : ""} ${diet.toLowerCase()}`}
                  onClick={() => setDietFilter(diet)}
                >
                  {diet === "Veg" && "🟢"}
                  {diet === "Non-Veg" && "🔴"}
                  {diet === "Vegan" && "🌱"}
                  {diet}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        <span className="count-number">{filteredItems.length}</span>
        <span className="count-text">items found</span>
        {(search || activeTab !== "All" || dietFilter !== "All") && (
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* 🍴 Compact Menu Grid - 3 items per row */}
      <div className="menu-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div 
              className={`menu-card ${item.featured ? "featured" : ""}`} 
              key={item.id}
              ref={addToRefs}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.featured && <div className="featured-badge">Chef's Choice</div>}
              <div className="card-image-container">
                <img src={item.img} alt={item.name} className="menu-img" />
                <div className="card-overlay">
                  <button
                    className="btn-overlay view-btn"
                    onClick={() => {
                      setModalItem(item);
                      setShow3D(false);
                    }}
                  >
                    👁 View
                  </button>
                  <button
                    className="btn-overlay ar-btn"
                    onClick={() => {
                      setModalItem(item);
                      setShow3D(true);
                    }}
                  >
                    📱 3D
                  </button>
                </div>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3 className="item-name">{item.name}</h3>
                  <span className="price-tag">{item.price}</span>
                </div>
                <p className="item-desc">{item.desc}</p>
                <div className="card-footer">
                  <span className="category-tag">{item.category}</span>
                  <span className={`veg-indicator ${item.veg ? 'veg' : 'non-veg'} ${item.vegan ? 'vegan' : ''}`}>
                    {item.vegan ? '🌱' : (item.veg ? '🟢' : '🔴')}
                    <span className="diet-tooltip">
                      {item.vegan ? 'Vegan' : (item.veg ? 'Vegetarian' : 'Non-Vegetarian')}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🍽️</div>
            <h3>No items found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn-reset" onClick={clearAllFilters}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* 🪟 Modal */}
      {modalItem && (
        <div className="modal-backdrop" onClick={() => setModalItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalItem(null)}>
              ✕
            </button>

            <div className="modal-body">
              <div className="modal-media">
                {!show3D ? (
                  <div className="image-container">
                    <img
                      src={modalItem.img}
                      alt={modalItem.name}
                      className="modal-img"
                    />
                    {modalItem.featured && (
                      <div className="modal-featured-badge">Chef's Choice</div>
                    )}
                  </div>
                ) : (
                  <div className="model-container">
                    <model-viewer
                      src={modalItem.glb}
                      camera-controls
                      auto-rotate
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{
                        width: "100%",
                        height: "300px",
                        background: "transparent",
                        borderRadius: "12px",
                      }}
                    >
                      <button slot="ar-button" className="ar-button">
                        View in AR
                      </button>
                    </model-viewer>
                  </div>
                )}
              </div>

              <div className="modal-details">
                <div className="modal-header">
                  <div className="title-section">
                    <h2 className="modal-title">{modalItem.name}</h2>
                    <span className={`modal-veg-indicator ${modalItem.veg ? 'veg' : 'non-veg'} ${modalItem.vegan ? 'vegan' : ''}`}>
                      {modalItem.vegan ? '🌱 Vegan' : (modalItem.veg ? '🟢 Vegetarian' : '🔴 Non-Vegetarian')}
                    </span>
                  </div>
                  <p className="modal-price">{modalItem.price}</p>
                </div>
                
                <p className="modal-desc">{modalItem.desc}</p>

                {modalItem.ingredients && (
                  <div className="ingredients-section">
                    <h4 className="ingredients-title">
                      {t.ingredients || "Ingredients"}
                    </h4>
                    <p className="ingredients-list">{modalItem.ingredients}</p>
                  </div>
                )}

                {modalItem.category && (
                  <div className="category-section">
                    <span className="category-label">
                      {t.category || "Category"}
                    </span>
                    <span className="category-value">{modalItem.category}</span>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    className={`btn-modal ${!show3D ? "active" : ""}`}
                    onClick={() => setShow3D(false)}
                  >
                    View Image
                  </button>
                  <button
                    className={`btn-modal ${show3D ? "active" : ""}`}
                    onClick={() => setShow3D(true)}
                  >
                    View in 3D
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Changing Language...</div>
        </div>
      )}

      {/* Footer */}
      <div className="menu-footer">
        <div className="footer-content">
          <p className="footer-title">ÉCLAT ROYALE</p>
          <p className="footer-subtitle">Where every meal is a masterpiece</p>
          <div className="footer-info">
            <span>Reservations: +91 98765 43210</span>
            <span>•</span>
            <span>Open: 7 PM - 11 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
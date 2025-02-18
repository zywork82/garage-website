import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import PageTemplate from "../../components/pageTemplate/PageTemplate";
import Typography from "../../components/typography/Typography";
import BackButton from "../../components/BackButton/BackButton";
import PageGap from "../../components/pageGap/PageGap";
import "./Shop.css";

const Shop = () => {
  const { data, isLoading, error } = useFetch({
    url: 'https://script.google.com/macros/s/AKfycbyZVob9L1HLQh4PO5zbAwL9182lMBnMCF31wgnkUuq3BqMj_es-gnVsOfu601NhRIOq/exec?timestamp=${new Date().getTime()}'
  });

  // State to track quantities of each item
  const [quantities, setQuantities] = useState({});

  // Initialize quantities
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const initialQuantities = {};
      data.forEach((item) => {
        initialQuantities[item.itemName] = 0;
      });
      setQuantities(initialQuantities);
    }
  }, [data]);

  console.log("Fetched Shop Data:", data);

  if (error) {
    return (
      <PageTemplate>
        <Typography variant="largeHeading">Garage Shop</Typography>
        <Typography variant="body" className="error-message">
          Failed to load shop items. Please try again later. Error: {error}
        </Typography>
      </PageTemplate>
    );
  }

  if (!data) {
    console.error("Shop data is null or undefined.");
    return (
      <PageTemplate>
        <Typography variant="largeHeading">Garage Shop</Typography>
        <Typography variant="body" className="error-message">
          No data available at the moment. Please try again later.
        </Typography>
      </PageTemplate>
    );
  }

  if (isLoading) {
    return (
      <PageTemplate>
        <Typography variant="largeHeading">Garage Shop</Typography>
        <Typography variant="body">Loading shop items...</Typography>
      </PageTemplate>
    );
  }

  const incrementQuantity = (itemName) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: prev[itemName] + 1,
    }));
  };

  const decrementQuantity = (itemName) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: prev[itemName] > 0 ? prev[itemName] - 1 : 0,
    }));
  };

// Extract user information from data or define a default user
const user = data?.user || { name: "Guest", credits: 0 };


  const items = data.filter(
    (entry) => entry.itemName && entry.innocreditPrice !== undefined
  );

  console.log("Rendered Items:", items);

  return (
    <PageTemplate>
      <PageGap>
        <div className="heading-space">
          <Typography variant="heading">Garage Shop</Typography>
          <BackButton />
        </div>

        <div className="heading-space">
          <Typography variant="smallHeading">
            Welcome to Garage Shop, {user.name.toUpperCase()}
          </Typography>
          <div className="credits">
            <Typography variant="body" className="credits-label">
              Inno Credits:
            </Typography>
            <Typography variant="body" className="credits-value">{user.credits}</Typography>
            <img
              src="/coin-icon.png"
              alt="Credits Icon"
              className="credits-icon"
            />
          </div>
        </div>

        <div className="shop-items-container">
          {items.map((item, index) => (
            <div className="shop-item" key={index}>
              <img
                src={item.image?.preview_url || "/default-placeholder.png"}
                alt={item.itemName || "Unnamed Item"}
                className="item-image"
                onError={(e) => (e.target.src = "/default-placeholder.png")}
              />

              <Typography variant="subtitle" className="item-description">
                {item.description || "No description available."}
              </Typography>

              <Typography variant="body" className="item-name">
                {item.itemName || "No Name"}
              </Typography>

              <div className="item-price">
                <Typography variant="body">
                  {item.innocreditPrice || 0} Credits
                </Typography>
                <img
                  src="/coin-icon.png"
                  alt="Credits Icon"
                  className="credits-icon"
                />
              </div>

              <div className="item-stock-quantity">
                <Typography variant="body" className="item-stock">
                  {item.inventory ? `Stock: ${item.inventory}` : "Out of Stock"}
                </Typography>
                <div className="quantity-controls">
                  <button
                    onClick={() => decrementQuantity(item.itemName)}
                    disabled={quantities[item.itemName] === 0}
                  >
                    -
                  </button>
                  <Typography variant="body" className="quantity-count">
                    {quantities[item.itemName]}
                  </Typography>
                  <button
                    onClick={() => incrementQuantity(item.itemName)}
                    disabled={
                      item.inventory &&
                      quantities[item.itemName] >= item.inventory
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout">
          <button className="checkout-button">
            <img
              src="/shopping-cart.png"
              alt="Cart Icon"
              className="cart-icon"
            />
            Check Out
          </button>
        </div>
      </PageGap>
    </PageTemplate>
  );
};

export default Shop;

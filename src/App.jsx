import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [layers, setLayers] = useState(2);
  const [layerColors, setLayerColors] = useState(Array(5).fill('#f3e5ab'));
  const [toppings, setToppings] = useState([]);
  const [tierType, setTierType] = useState('single');
  const [tierCount, setTierCount] = useState(2);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const availableFrostings = [
    { id: 'vanilla', name: 'Vanilla', color: '#f3e5ab' },
    { id: 'chocolate', name: 'Chocolate', color: '#4b2c20' },
    { id: 'strawberry', name: 'Strawberry', color: '#ff69b4' },
  ];

  const availableToppings = [
    { id: 'sprinkles', name: 'Sprinkles' },
    { id: 'fruit', name: 'Fresh Fruit' },
    { id: 'chocolate-chips', name: 'Chocolate Chips' },
    { id: 'icing', name: 'Icing' },
    { id: 'icing-decorations', name: 'Icing Decorations' },
  ];

  const handleToppingChange = (topping) => {
    setToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    );
  };

  const handleLayerColorChange = (index, color) => {
    const newColors = [...layerColors];
    newColors[index] = color;
    setLayerColors(newColors);
  };

  const handleSubmit = async () => {
    if (!email) {
      setSubmitMessage('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          tierType,
          tierCount,
          layers: layerColors.slice(0, layers),
          toppings,
        }),
      });

      if (response.ok) {
        setSubmitMessage('Email sent successfully!');
      } else {
        setSubmitMessage('Failed to send email. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCakePreview = () => {
    if (tierType === 'single') {
      return (
        <div className="cake-preview">
          {Array.from({ length: layers }).map((_, i) => (
            <div
              key={i}
              className="cake-layer"
              style={{
                backgroundColor: layerColors[i],
                width: '200px',
              }}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className="cake-preview multi-tier">
          {Array.from({ length: tierCount })
            .map((_, i) => ({
              index: i,
              width: 200 - i * 40,
            }))
            .reverse()
            .map(({ index, width }) => (
              <div key={index} className="tier">
                {Array.from({ length: layers }).map((_, j) => (
                  <div
                    key={j}
                    className="cake-layer"
                    style={{
                      backgroundColor: layerColors[j],
                      width: `${width}px`,
                    }}
                  />
                ))}
              </div>
            ))}
        </div>
      );
    }
  };

  return (
    <div className="container">
      <h1>The Cake Lounge</h1>

      <div className="company-info">
        <p>36/3 Jambugasmulla Mawatha, Nugegoda 10250, Sri Lanka</p>
        <p>Phone: +94 72 368 4367</p>
      </div>

      <div className="note">
        <p>After designing your cake, enter your email below to receive the design.</p>
      </div>

      {renderCakePreview()}

      <div className="controls">
        <div className="control-group">
          <h3>Tier Type</h3>
          <label>
            <input
              type="radio"
              name="tierType"
              value="single"
              checked={tierType === 'single'}
              onChange={() => setTierType('single')}
            />
            Single Tier
          </label>
          <label>
            <input
              type="radio"
              name="tierType"
              value="multi"
              checked={tierType === 'multi'}
              onChange={() => setTierType('multi')}
            />
            Multi Tier
          </label>
        </div>

        {tierType === 'multi' && (
          <div className="control-group">
            <h3>Number of Tiers</h3>
            <input
              type="range"
              min="2"
              max="6"
              value={tierCount}
              onChange={(e) => setTierCount(Number(e.target.value))}
            />
            <p>{tierCount} tier{tierCount !== 1 && 's'}</p>
          </div>
        )}

        <div className="control-group">
          <h3>Layers</h3>
          <input
            type="range"
            min="1"
            max="5"
            value={layers}
            onChange={(e) => setLayers(Number(e.target.value))}
          />
          <p>{layers} layer{layers !== 1 && 's'}</p>
          {Array.from({ length: layers }).map((_, i) => (
            <div key={i} className="color-picker">
              <label>Layer {i + 1} Color:</label>
              <input
                type="color"
                value={layerColors[i]}
                onChange={(e) => handleLayerColorChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="control-group">
          <h3>Toppings</h3>
          {availableToppings.map(t => (
            <label key={t.id}>
              <input
                type="checkbox"
                checked={toppings.includes(t.id)}
                onChange={() => handleToppingChange(t.id)}
              />
              {t.name}
            </label>
          ))}
        </div>

        <div className="control-group">
          <h3>Email Address</h3>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#6d4c41',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1rem',
          }}
        >
          {isSubmitting ? 'Sending...' : 'Submit Design'}
        </button>

        {submitMessage && (
          <p style={{ color: submitMessage.includes('success') ? 'green' : 'red', marginTop: '1rem' }}>
            {submitMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;

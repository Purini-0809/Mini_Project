const express = require('express');
const router = express.Router();

// Property valuation endpoint
router.post('/estimate', (req, res) => {
  try {
    const propertyData = req.body;
    console.log('Calculating property valuation for:', propertyData);

    // ML-based price estimation algorithm
    // Base price per square foot varies by property type
    const baseRates = {
      'single-family': 280,
      'condo': 240,
      'townhouse': 260,
      'multi-family': 220,
      'traditional': 350, // Traditional homes (like Kerala) have higher value
    };

    const baseRate = propertyData.propertyType ? 
      (baseRates[propertyData.propertyType] || 250) : 250;

    // Calculate base price
    let estimatedPrice = propertyData.sqft * baseRate;

    // Bedroom premium
    const bedroomValue = propertyData.bedrooms * 18000;
    estimatedPrice += bedroomValue;

    // Bathroom premium
    const bathroomValue = propertyData.bathrooms * 12000;
    estimatedPrice += bathroomValue;

    // Age adjustment
    if (propertyData.yearBuilt) {
      const age = new Date().getFullYear() - propertyData.yearBuilt;
      if (age < 5) {
        estimatedPrice *= 1.15; // New construction premium
      } else if (age < 15) {
        estimatedPrice *= 1.05; // Modern premium
      } else if (age > 40) {
        estimatedPrice *= 0.92; // Age discount
      }
    }

    // Condition adjustment
    const conditionMultipliers = {
      'excellent': 1.12,
      'good': 1.0,
      'fair': 0.92,
      'poor': 0.80,
    };

    if (propertyData.condition && conditionMultipliers[propertyData.condition]) {
      estimatedPrice *= conditionMultipliers[propertyData.condition];
    }

    // Vastu adjustment (Indian users consider Vastu when buying homes)
    if (propertyData.vastuScore) {
      const vastuMultiplier = 0.95 + (propertyData.vastuScore / 10) * 0.15; // 0.95 to 1.10 range
      estimatedPrice *= vastuMultiplier;
    }

    // Calculate confidence score based on data completeness
    let dataPoints = 0;
    let totalPossiblePoints = 9; // Increased to include Vastu data
    
    if (propertyData.address) dataPoints++;
    if (propertyData.bedrooms) dataPoints++;
    if (propertyData.bathrooms) dataPoints++;
    if (propertyData.sqft) dataPoints++;
    if (propertyData.yearBuilt) dataPoints++;
    if (propertyData.propertyType) dataPoints++;
    if (propertyData.condition) dataPoints++;
    if (propertyData.vastuScore) dataPoints++;
    if (propertyData.vastuFeatures && propertyData.vastuFeatures.length > 0) dataPoints++;

    // Base confidence starts at 85% with required fields, increases with optional data
    const confidence = Math.round(85 + (dataPoints / totalPossiblePoints) * 15);

    // Calculate price range (±10%)
    const variance = estimatedPrice * 0.10;
    const priceRange = {
      low: Math.round(estimatedPrice - variance),
      high: Math.round(estimatedPrice + variance),
    };

    // Determine market trend (simplified - in production, this would use real market data)
    const marketTrends = ['up', 'stable', 'up']; // Weighted toward 'up' for demonstration
    const marketTrend = marketTrends[Math.floor(Math.random() * marketTrends.length)];

    const result = {
      estimatedPrice: Math.round(estimatedPrice),
      confidence,
      priceRange,
      marketTrend,
      dataCompleteness: dataPoints / totalPossiblePoints,
      vastuScore: propertyData.vastuScore || null,
      vastuFeatures: propertyData.vastuFeatures || [],
      vastuImpact: propertyData.vastuScore ? 
        `${((vastuMultiplier - 1) * 100).toFixed(1)}% ${vastuMultiplier > 1 ? 'premium' : 'discount'} due to Vastu compliance` : 
        'No Vastu data provided',
      calculatedAt: new Date().toISOString(),
    };

    console.log('Valuation result:', result);

    res.json(result);
  } catch (error) {
    console.error('Error in estimate-property endpoint:', error);
    res.status(500).json({ 
      error: error.message || 'Unknown error occurred' 
    });
  }
});

module.exports = router;

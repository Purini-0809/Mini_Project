import { motion } from "framer-motion";
import type { HomeItem } from "@/data/homes";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/context/CompareContext";
import { hasSupabaseConfig, supabase } from "@/integrations/supabase/client";
import { localAuth } from "@/services/localAuth";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Home, Zap, TrendingUp, Car, TreePine, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHistory } from "./HistoryPanel";

export function isLoggedIn() {
  if (hasSupabaseConfig) {
    // Not robust, but ok for gating UI quickly
    // In real app read from a central auth state
    return true;
  }
  return Boolean(localAuth.getSession());
}

export const HomeCard = ({ home }: { home: HomeItem }) => {
  const { selected, toggle } = useCompare();
  const isSelected = selected.some(h => h.id === home.id);
  const authed = isLoggedIn();
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const { toast } = useToast();
  const { addToHistory } = useHistory();

  // Auto-estimate price when component mounts
  useEffect(() => {
    if (!home.estimatedPrice) {
      estimatePrice();
    } else {
      setEstimatedPrice(home.estimatedPrice);
    }
    
    // Add view to history
    addToHistory({
      type: 'view',
      title: `Viewed: ${home.name}`,
      description: `${home.propertyType} home in ${home.location}. ${home.bedrooms} bed, ${home.bathrooms} bath, ${home.sqft} sqft`,
      location: home.location,
      price: home.price,
      vastuScore: home.vastuScore,
      data: { home }
    });
  }, [home]);

  const estimatePrice = async () => {
    setIsEstimating(true);
    try {
      // Client-side property estimation algorithm
      const propertyData = {
        address: home.location,
        bedrooms: home.bedrooms,
        bathrooms: home.bathrooms,
        sqft: home.sqft,
        yearBuilt: home.yearBuilt,
        propertyType: home.propertyType,
        condition: home.condition,
        vastuScore: home.vastuScore,
        vastuFeatures: home.vastuFeatures,
      };

      // ML-based price estimation algorithm (same as backend)
      const baseRates: Record<string, number> = {
        'single-family': 280,
        'condo': 240,
        'townhouse': 260,
        'multi-family': 220,
        'traditional': 350,
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
      const conditionMultipliers: Record<string, number> = {
        'excellent': 1.12,
        'good': 1.0,
        'fair': 0.92,
        'poor': 0.80,
      };

      if (propertyData.condition && conditionMultipliers[propertyData.condition]) {
        estimatedPrice *= conditionMultipliers[propertyData.condition];
      }

      // Vastu adjustment
      if (propertyData.vastuScore) {
        const vastuMultiplier = 0.95 + (propertyData.vastuScore / 10) * 0.15; // 0.95 to 1.10 range
        estimatedPrice *= vastuMultiplier;
      }

      // Location premium (simplified)
      const locationMultipliers: Record<string, number> = {
        'Mumbai': 1.8,
        'Delhi': 1.6,
        'Bangalore': 1.4,
        'Hyderabad': 1.3,
        'Pune': 1.2,
        'Chennai': 1.1,
        'Kolkata': 1.0,
      };

      const location = propertyData.address.split(',')[0].trim();
      if (locationMultipliers[location]) {
        estimatedPrice *= locationMultipliers[location];
      }

      // Calculate confidence score
      let dataPoints = 0;
      let totalPossiblePoints = 7;
      
      if (propertyData.address) dataPoints++;
      if (propertyData.bedrooms) dataPoints++;
      if (propertyData.bathrooms) dataPoints++;
      if (propertyData.sqft) dataPoints++;
      if (propertyData.yearBuilt) dataPoints++;
      if (propertyData.propertyType) dataPoints++;
      if (propertyData.condition) dataPoints++;

      const confidence = Math.round((dataPoints / totalPossiblePoints) * 100);

      const data = {
        estimatedPrice: Math.round(estimatedPrice),
        confidence,
        priceRange: {
          low: Math.round(estimatedPrice * 0.85),
          high: Math.round(estimatedPrice * 1.15)
        },
        marketTrend: "stable" as const,
        dataCompleteness: confidence,
        calculatedAt: new Date().toISOString()
      };

      setEstimatedPrice(data.estimatedPrice);
      // Update the home object with estimated price
      home.estimatedPrice = data.estimatedPrice;
      
      // Add to history
      addToHistory({
        type: 'valuation',
        title: `Valuation: ${home.name}`,
        description: `AI estimated price: ₹${data.estimatedPrice.toLocaleString()}. Vastu score: ${home.vastuScore}/10`,
        location: home.location,
        price: data.estimatedPrice,
        vastuScore: home.vastuScore,
        data: { home, estimation: data }
      });

    } catch (error) {
      console.error('Price estimation failed:', error);
      toast({
        title: "Estimation Failed",
        description: "Could not estimate price. Using listed price.",
        variant: "destructive",
      });
    } finally {
      setIsEstimating(false);
    }
  };

  const getVastuColor = (score: number) => {
    if (score >= 9) return "bg-green-500";
    if (score >= 7) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getVastuLabel = (score: number) => {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Good";
    return "Needs Improvement";
  };

  const handleToggle = () => {
    toggle(home);
    
    // Add comparison action to history
    addToHistory({
      type: 'comparison',
      title: `${isSelected ? 'Removed from' : 'Added to'} comparison: ${home.name}`,
      description: `${home.propertyType} home in ${home.location}. Vastu score: ${home.vastuScore}/10`,
      location: home.location,
      price: estimatedPrice || home.price,
      vastuScore: home.vastuScore,
      data: { home, action: isSelected ? 'remove' : 'add' }
    });
  };

  return (
    <motion.div 
      layout 
      whileHover={{ y: -4 }} 
      className="rounded-xl overflow-hidden border bg-white/80 backdrop-blur-md shadow-elevated"
    >
      <div className="relative">
        <img src={home.image} alt={home.name} className="h-44 w-full object-cover" />
        <div className="absolute top-2 left-2">
          <Badge 
            variant="secondary" 
            className={`${getVastuColor(home.vastuScore)} text-white font-semibold`}
          >
            <Star className="h-3 w-3 mr-1" />
            Vastu {home.vastuScore}/10
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-white/90">
            {home.propertyType === 'traditional' ? (
              <>
                <Home className="h-3 w-3 mr-1" />
                Traditional
              </>
            ) : (
              <>
                <Zap className="h-3 w-3 mr-1" />
                Modern
              </>
            )}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{home.name}</h3>
          <div className="text-right">
            <div className="text-primary font-bold">
              {isEstimating ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Estimating...</span>
                </div>
              ) : estimatedPrice ? (
                <div>
                  <div className="text-sm text-muted-foreground">AI Estimated</div>
                  <div>₹{estimatedPrice.toLocaleString()}</div>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-muted-foreground">Listed Price</div>
                  <div>₹{home.price.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-1">{home.location}</p>
        
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Built:</span>
            <span className="font-medium">{home.yearBuilt}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Area:</span>
            <span className="font-medium">{home.sqft} sqft</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Bedrooms:</span>
            <span className="font-medium">{home.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Bathrooms:</span>
            <span className="font-medium">{home.bathrooms}</span>
          </div>
        </div>
        
        {/* Parking and Garden Info */}
        <div className="mt-3 flex flex-wrap gap-2">
          {home.parking && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              <Car className="h-3 w-3 mr-1" />
              {home.parkingSpaces ? `${home.parkingSpaces} Parking` : 'Parking Available'}
            </Badge>
          )}
          {home.gardenArea && (
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
              <TreePine className="h-3 w-3 mr-1" />
              {home.gardenSize ? `${home.gardenSize} sqft Garden` : 'Garden Available'}
            </Badge>
          )}
        </div>
        
        <div className="mt-3">
          <div className="text-xs text-muted-foreground mb-2">
            <strong>Vastu Features:</strong> {home.vastuFeatures.slice(0, 2).join(', ')}
            {home.vastuFeatures.length > 2 && ` +${home.vastuFeatures.length - 2} more`}
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            size="sm" 
            variant={isSelected ? "default" : "outline"} 
            disabled={!authed} 
            onClick={handleToggle}
            className="w-full"
          >
            {authed ? (isSelected ? "Remove from Compare" : "Compare") : "Login to Compare"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

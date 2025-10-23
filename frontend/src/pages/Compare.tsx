import { Helmet } from "react-helmet";
import { useCompare } from "@/context/CompareContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedIn } from "@/components/HomeCard";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Car, TreePine, Home, Calendar, MapPin, TrendingUp, Trash2 } from "lucide-react";

const ComparePage = () => {
  const { selected, clear, toggle } = useCompare();
  const authed = isLoggedIn();

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(0)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getVastuColor = (score: number) => {
    if (score >= 9) return "bg-green-500";
    if (score >= 7) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
        <div className="rounded-xl bg-white/80 backdrop-blur-md border p-8 text-center max-w-md w-full shadow-elevated">
          <h1 className="text-2xl font-bold mb-2">Login to Compare</h1>
          <p className="text-muted-foreground mb-6">Sign in to select multiple homes and view a detailed comparison.</p>
          <Link to="/auth"><Button>Go to Login</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>Compare Homes - Smart Home Valuation</title>
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">Compare Homes</h1>
            <p className="text-primary-foreground/80">
              Detailed side-by-side comparison of selected properties
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clear} disabled={selected.length === 0}>
              Clear All
            </Button>
            <Link to="/homes">
              <Button>Add More Homes</Button>
            </Link>
        </div>
        </motion.div>

        {selected.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <Card className="max-w-md mx-auto p-8 bg-white/80 backdrop-blur-md">
              <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Homes Selected</h3>
              <p className="text-muted-foreground mb-6">
                Select homes from the listings page to compare their features, pricing, and Vastu scores.
              </p>
              <Link to="/homes">
                <Button className="w-full">Browse Homes</Button>
              </Link>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {selected.map((home, index) => (
                  <motion.div
                    key={home.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-white/80 backdrop-blur-md border-2 hover:border-primary/50 transition-all duration-300">
                      {/* Image */}
                      <div className="relative">
                        <img 
                          src={home.image} 
                          alt={home.name} 
                          className="h-48 w-full object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={`${getVastuColor(home.vastuScore)} text-white font-semibold`}>
                            <Star className="h-3 w-3 mr-1" />
                            Vastu {home.vastuScore}/10
                          </Badge>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-3 right-3 h-8 w-8"
                          onClick={() => toggle(home)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{home.name}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{home.location}</span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-primary">
                            {formatPrice(home.price)}
                          </div>
                          {home.estimatedPrice && (
                            <div className="text-sm text-muted-foreground">
                              AI Estimated: {formatPrice(home.estimatedPrice)}
                            </div>
                          )}
                        </div>

                        {/* Key Features */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Home className="h-4 w-4 text-muted-foreground" />
                              <span>{home.bedrooms} bed</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{home.yearBuilt}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span>{home.sqft} sqft</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">{home.bathrooms} bath</span>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="flex flex-wrap gap-1">
                            {home.parking && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                <Car className="h-3 w-3 mr-1" />
                                {home.parkingSpaces} Parking
                              </Badge>
                            )}
                            {home.gardenArea && (
                              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">
                                <TreePine className="h-3 w-3 mr-1" />
                                {home.gardenSize} sqft Garden
                              </Badge>
                            )}
                          </div>

                          {/* Vastu Features */}
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Vastu Features:</h4>
                            <div className="flex flex-wrap gap-1">
                              {home.vastuFeatures.slice(0, 2).map((feature, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {home.vastuFeatures.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{home.vastuFeatures.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Comparison Table */}
            {selected.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-white/80 backdrop-blur-md border-2">
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Detailed Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-semibold">Feature</th>
                            {selected.map((home) => (
                              <th key={home.id} className="text-center p-3 font-semibold min-w-[150px]">
                                {home.name}
                              </th>
                            ))}
                </tr>
              </thead>
              <tbody>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Price</td>
                            {selected.map((home) => (
                              <td key={home.id} className="p-3 text-center font-semibold text-primary">
                                {formatPrice(home.price)}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Location</td>
                            {selected.map((home) => (
                              <td key={home.id} className="p-3 text-center">
                                {home.location}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Year Built</td>
                            {selected.map((home) => (
                              <td key={home.id} className="p-3 text-center">
                                {home.yearBuilt}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Area (sqft)</td>
                            {selected.map((home) => (
                              <td key={home.id} className="p-3 text-center">
                                {home.sqft}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Bedrooms</td>
                            {selected.map((home) => (
                              <td key={home.id} className="p-3 text-center">
                                {home.bedrooms}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Bathrooms</td>
                            {selected.map((home) => (
                              <td key={home.id} className="p-3 text-center">
                                {home.bathrooms}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Vastu Score</td>
                            {selected.map((home) => (
                              <td key={home.id} className="p-3 text-center">
                                <Badge className={`${getVastuColor(home.vastuScore)} text-white`}>
                                  {home.vastuScore}/10
                                </Badge>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Parking</td>
                            {selected.map((home) => (
                              <td key={home.id} className="p-3 text-center">
                                {home.parking ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700">
                                    {home.parkingSpaces} spaces
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground">No</span>
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 font-medium">Garden</td>
                            {selected.map((home) => (
                              <td key={home.id} className="p-3 text-center">
                                {home.gardenArea ? (
                                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                                    {home.gardenSize} sqft
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground">No</span>
                                )}
                      </td>
                  ))}
                          </tr>
              </tbody>
            </table>
          </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, Car, TreePine, Home, Calendar } from "lucide-react";
import type { HomeItem } from "@/data/homes";

interface SearchFiltersProps {
  homes: HomeItem[];
  onFilteredHomes: (homes: HomeItem[]) => void;
}

export const SearchFilters = ({ homes, onFilteredHomes }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [yearRange, setYearRange] = useState([1990, 2024]);
  const [bedrooms, setBedrooms] = useState<string>("all");
  const [bathrooms, setBathrooms] = useState<string>("all");
  const [hasParking, setHasParking] = useState<boolean | null>(null);
  const [hasGarden, setHasGarden] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const maxPrice = Math.max(...homes.map(h => h.price));
  const minPrice = Math.min(...homes.map(h => h.price));
  const maxYear = Math.max(...homes.map(h => h.yearBuilt));
  const minYear = Math.min(...homes.map(h => h.yearBuilt));

  useEffect(() => {
    // Initialize price range with actual data
    setPriceRange([minPrice, maxPrice]);
    setYearRange([minYear, maxYear]);
  }, [homes, minPrice, maxPrice, minYear, maxYear]);

  useEffect(() => {
    const filtered = homes.filter(home => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        home.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        home.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        home.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Price filter
      const matchesPrice = home.price >= priceRange[0] && home.price <= priceRange[1];

      // Year filter
      const matchesYear = home.yearBuilt >= yearRange[0] && home.yearBuilt <= yearRange[1];

      // Bedrooms filter
      const matchesBedrooms = bedrooms === "all" || home.bedrooms.toString() === bedrooms;

      // Bathrooms filter
      const matchesBathrooms = bathrooms === "all" || home.bathrooms.toString() === bathrooms;

      // Parking filter
      const matchesParking = hasParking === null || home.parking === hasParking;

      // Garden filter
      const matchesGarden = hasGarden === null || home.gardenArea === hasGarden;

      return matchesSearch && matchesPrice && matchesYear && matchesBedrooms && 
             matchesBathrooms && matchesParking && matchesGarden;
    });

    onFilteredHomes(filtered);

    // Count active filters
    let count = 0;
    if (searchQuery) count++;
    if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) count++;
    if (yearRange[0] !== minYear || yearRange[1] !== maxYear) count++;
    if (bedrooms !== "all") count++;
    if (bathrooms !== "all") count++;
    if (hasParking !== null) count++;
    if (hasGarden !== null) count++;
    
    setActiveFilters(count);
  }, [searchQuery, priceRange, yearRange, bedrooms, bathrooms, hasParking, hasGarden, homes, onFilteredHomes, minPrice, maxPrice, minYear, maxYear]);

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([minPrice, maxPrice]);
    setYearRange([minYear, maxYear]);
    setBedrooms("all");
    setBathrooms("all");
    setHasParking(null);
    setHasGarden(null);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(0)}L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search homes by name, location, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-20 h-12 text-lg bg-white/80 backdrop-blur-md border-2 focus:border-primary transition-all duration-300"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {activeFilters > 0 && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {activeFilters}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 px-3"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-white/80 backdrop-blur-md border-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={maxPrice}
                      min={minPrice}
                      step={100000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                {/* Year Built */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Year Built
                  </label>
                  <div className="space-y-2">
                    <Slider
                      value={yearRange}
                      onValueChange={setYearRange}
                      max={maxYear}
                      min={minYear}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{yearRange[0]}</span>
                      <span>{yearRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Bedrooms</label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bathrooms */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Bathrooms</label>
                  <Select value={bathrooms} onValueChange={setBathrooms}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Parking */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Parking
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="parking-yes"
                        checked={hasParking === true}
                        onCheckedChange={(checked) => setHasParking(checked ? true : null)}
                      />
                      <label htmlFor="parking-yes" className="text-sm">Has Parking</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="parking-no"
                        checked={hasParking === false}
                        onCheckedChange={(checked) => setHasParking(checked ? false : null)}
                      />
                      <label htmlFor="parking-no" className="text-sm">No Parking</label>
                    </div>
                  </div>
                </div>

                {/* Garden */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <TreePine className="h-4 w-4" />
                    Garden Area
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="garden-yes"
                        checked={hasGarden === true}
                        onCheckedChange={(checked) => setHasGarden(checked ? true : null)}
                      />
                      <label htmlFor="garden-yes" className="text-sm">Has Garden</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="garden-no"
                        checked={hasGarden === false}
                        onCheckedChange={(checked) => setHasGarden(checked ? false : null)}
                      />
                      <label htmlFor="garden-no" className="text-sm">No Garden</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

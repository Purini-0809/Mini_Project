import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HomeCard } from "./HomeCard";
import { homes } from "@/data/homes";
import { Link } from "react-router-dom";
import { Star, Home, TreePine, Car, MapPin, Calendar } from "lucide-react";

export const PenkutiIllulu = () => {
  const traditionalHomes = homes.filter(home => home.propertyType === 'traditional');

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Home className="h-4 w-4" />
            <span>Penkuti Illulu</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Traditional Heritage Homes
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the timeless beauty of traditional Indian architecture. These heritage homes 
            blend ancient wisdom with modern comfort, featuring Vastu-compliant designs and 
            authentic craftsmanship.
          </p>
        </motion.div>

        {/* Featured Traditional Home */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="overflow-hidden bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-200">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative">
                <img 
                  src={traditionalHomes[0]?.image} 
                  alt={traditionalHomes[0]?.name}
                  className="h-80 w-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-amber-600 text-white font-semibold">
                    <Star className="h-3 w-3 mr-1" />
                    Featured Heritage Home
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{traditionalHomes[0]?.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {traditionalHomes[0]?.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {traditionalHomes[0]?.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">
                      ₹{(traditionalHomes[0]?.price / 10000000).toFixed(1)}Cr
                    </div>
                    <div className="text-sm text-gray-600">Starting Price</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">
                      {traditionalHomes[0]?.vastuScore}/10
                    </div>
                    <div className="text-sm text-gray-600">Vastu Score</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {traditionalHomes[0]?.parking && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Car className="h-3 w-3 mr-1" />
                      {traditionalHomes[0]?.parkingSpaces} Parking
                    </Badge>
                  )}
                  {traditionalHomes[0]?.gardenArea && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      <TreePine className="h-3 w-3 mr-1" />
                      {traditionalHomes[0]?.gardenSize} sqft Garden
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Calendar className="h-3 w-3 mr-1" />
                    Built {traditionalHomes[0]?.yearBuilt}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Vastu Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {traditionalHomes[0]?.vastuFeatures.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Traditional Homes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {traditionalHomes.slice(1).map((home, index) => (
              <motion.div
                key={home.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <HomeCard home={home} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-8">
            <h3 className="text-2xl font-bold mb-4">
              Discover More Traditional Homes
            </h3>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Explore our complete collection of heritage homes, each carefully selected 
              for their architectural significance and Vastu compliance.
            </p>
            <Link to="/homes">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-amber-600 hover:bg-amber-50 font-semibold"
              >
                View All Traditional Homes
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

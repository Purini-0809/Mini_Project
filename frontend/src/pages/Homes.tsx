import { Helmet } from "react-helmet";
import { homes } from "@/data/homes";
import { HomeCard } from "@/components/HomeCard";
import { motion } from "framer-motion";
import { isLoggedIn } from "@/components/HomeCard";
import { Link } from "react-router-dom";
import { SearchFilters } from "@/components/SearchFilters";
import { PenkutiIllulu } from "@/components/PenkutiIllulu";
import { useState } from "react";
import type { HomeItem } from "@/data/homes";

const HomesPage = () => {
  const authed = isLoggedIn();
  const [filteredHomes, setFilteredHomes] = useState<HomeItem[]>(homes);
  const visible = authed ? filteredHomes : filteredHomes.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>Browse Homes - Smart Home Valuation</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">Browse Homes</h1>
            <p className="text-primary-foreground/80">
              Discover your perfect home with AI-powered valuations and Vastu insights
            </p>
          </motion.div>
          {!authed && (
            <motion.div 
              className="text-sm text-primary-foreground/80"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Login to compare more homes. <Link className="underline hover:text-primary-foreground transition-colors" to="/auth">Login</Link>
            </motion.div>
          )}
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <SearchFilters homes={homes} onFilteredHomes={setFilteredHomes} />
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-primary-foreground/80">
            Showing {visible.length} of {homes.length} homes
          </p>
        </motion.div>

        {/* Homes Grid */}
        <motion.div 
          layout 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {visible.map((home, index) => (
            <motion.div
              key={home.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <HomeCard home={home} />
            </motion.div>
          ))}
        </motion.div>

        {/* Penkuti Illulu Section */}
        <PenkutiIllulu />
      </div>
    </div>
  );
};

export default HomesPage;

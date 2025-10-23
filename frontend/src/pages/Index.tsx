import { useState } from "react";
import { Hero } from "@/components/Hero";
import { ValuationForm } from "@/components/ValuationForm";
import { ValuationResult } from "@/components/ValuationResult";
import { Features } from "@/components/Features";
import { PenkutiIllulu } from "@/components/PenkutiIllulu";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import { api, type PropertyData, type ValuationResult as ValuationResultType } from "@/services/api";

interface FormPropertyData {
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  yearBuilt: string;
  propertyType: string;
  condition: string;
}

const Index = () => {
  const [valuation, setValuation] = useState<ValuationResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    const element = document.getElementById("valuation-form");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEstimate = async (data: FormPropertyData) => {
    setIsLoading(true);
    
    try {
      console.log('Sending valuation request:', data);
      
      const result = await api.estimateProperty({
        address: data.address,
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseFloat(data.bathrooms),
        sqft: parseInt(data.sqft),
        yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : undefined,
        propertyType: data.propertyType || undefined,
        condition: data.condition || undefined,
      });

      console.log('Valuation result:', result);
      setValuation(result);
      toast.success("Valuation completed successfully!");
      
      // Scroll to results
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }, 100);
    } catch (error) {
      toast.error("Failed to calculate valuation. Please try again.");
      console.error("Valuation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Helmet>
        <title>Smart Home Valuation - ML-Based Price Estimation</title>
        <meta 
          name="description" 
          content="Get accurate property valuations in seconds using advanced machine learning. AI-powered home price estimates with 99.2% accuracy rate." 
        />
        <meta 
          name="keywords" 
          content="home valuation, property price estimate, ML real estate, AI home valuation, property appraisal" 
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-hero">
        <Hero onGetStarted={handleGetStarted} />
        <Features />
        <ValuationForm onEstimate={handleEstimate} isLoading={isLoading} />
        {valuation && <ValuationResult {...valuation} />}
        <PenkutiIllulu />
      </main>
    </div>
  );
};

export default Index;

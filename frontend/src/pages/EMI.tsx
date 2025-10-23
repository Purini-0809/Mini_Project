import { Helmet } from "react-helmet";
import { EMICalculator } from "@/components/EMICalculator";

const EMIPage = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Helmet>
        <title>Home Loan EMI Calculator - Smart Home Valuation</title>
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-primary-foreground mb-6">EMI Calculator</h1>
        <EMICalculator />
      </div>
    </div>
  );
};

export default EMIPage;

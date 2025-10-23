import { Button } from "@/components/ui/button";
import { Home, TrendingUp, Zap } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";
import { Link } from "react-router-dom";

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern smart home showcasing advanced architecture and design"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl animate-fade-in">
          <div className="flex items-center gap-2 mb-6 text-accent">
            <Zap className="w-6 h-6 animate-pulse-glow" />
            <span className="text-sm font-semibold uppercase tracking-wide">AI-Powered Valuation</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Smart Home Valuation
            <span className="block text-accent mt-2">Precision Through ML</span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 max-w-2xl leading-relaxed">
            Get accurate property valuations in seconds using advanced machine learning algorithms. 
            Our AI analyzes thousands of data points to deliver market-leading price estimates.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              variant="hero"
              onClick={onGetStarted}
              className="text-lg px-8 py-6 h-auto"
            >
              <Home className="w-5 h-5 mr-2" />
              Get Instant Valuation
            </Button>
            <Link to="/emi">
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 h-auto bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                EMI Calculator
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl">
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="text-4xl font-bold text-accent mb-2">99.2%</div>
              <div className="text-sm text-primary-foreground/80">Accuracy Rate</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl font-bold text-accent mb-2">&lt;3s</div>
              <div className="text-sm text-primary-foreground/80">Average Response</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="text-4xl font-bold text-accent mb-2">500K+</div>
              <div className="text-sm text-primary-foreground/80">Properties Analyzed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

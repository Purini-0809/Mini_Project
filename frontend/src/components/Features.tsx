import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap, Shield, TrendingUp, Database, Clock } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Advanced ML Models",
    description: "Proprietary algorithms trained on millions of real estate transactions for unmatched accuracy",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get comprehensive valuations in under 3 seconds with real-time market analysis",
  },
  {
    icon: Database,
    title: "Comprehensive Data",
    description: "We analyze 500+ data points including neighborhood trends, schools, and market dynamics",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Understand price trends and market conditions with detailed analytics and forecasts",
  },
  {
    icon: Shield,
    title: "Trusted Accuracy",
    description: "99.2% accuracy rate validated by industry professionals and real transaction data",
  },
  {
    icon: Clock,
    title: "Always Updated",
    description: "Our models retrain daily with the latest market data to ensure current valuations",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose Our <span className="text-primary">ML Valuation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cutting-edge machine learning technology meets real estate expertise to deliver 
            the most accurate property valuations available
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-border hover:shadow-elevated transition-all duration-300 animate-slide-up bg-gradient-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

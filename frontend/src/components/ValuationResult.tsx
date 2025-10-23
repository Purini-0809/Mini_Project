import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, Home, DollarSign } from "lucide-react";

interface ValuationResultProps {
  estimatedPrice: number;
  confidence: number;
  priceRange: {
    low: number;
    high: number;
  };
  marketTrend: "up" | "stable" | "down";
}

export const ValuationResult = ({ estimatedPrice, confidence, priceRange, marketTrend }: ValuationResultProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return "text-success";
    if (conf >= 75) return "text-accent";
    return "text-muted-foreground";
  };

  const getTrendBadge = () => {
    const variants = {
      up: { label: "Appreciating", variant: "default" as const },
      stable: { label: "Stable", variant: "secondary" as const },
      down: { label: "Declining", variant: "destructive" as const },
    };
    return variants[marketTrend];
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl animate-fade-in">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Valuation Complete</h2>
          <p className="text-muted-foreground text-lg">Your property estimate is ready</p>
        </div>

        <Card className="shadow-elevated bg-gradient-card border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between flex-wrap gap-4">
              <span className="text-2xl">Estimated Value</span>
              <Badge variant={getTrendBadge().variant} className="text-sm px-3 py-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                {getTrendBadge().label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-8 h-8 text-primary" />
                <div className="text-6xl font-bold text-primary">
                  {formatPrice(estimatedPrice)}
                </div>
              </div>
              <p className="text-muted-foreground mt-2">
                Range: {formatPrice(priceRange.low)} - {formatPrice(priceRange.high)}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">ML Confidence Score</span>
                <span className={`text-xl font-bold ${getConfidenceColor(confidence)}`}>
                  {confidence}%
                </span>
              </div>
              <Progress value={confidence} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Our machine learning model is {confidence}% confident in this valuation based on current market data
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <Home className="w-8 h-8 text-primary mb-3" />
              <div className="text-2xl font-bold mb-1">{formatPrice(estimatedPrice / parseInt("2000"))}</div>
              <div className="text-sm text-muted-foreground">Price per Sq Ft</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <TrendingUp className="w-8 h-8 text-accent mb-3" />
              <div className="text-2xl font-bold mb-1">+5.2%</div>
              <div className="text-sm text-muted-foreground">vs Last Year</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <CheckCircle2 className="w-8 h-8 text-success mb-3" />
              <div className="text-2xl font-bold mb-1">28 days</div>
              <div className="text-sm text-muted-foreground">Est. Market Time</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

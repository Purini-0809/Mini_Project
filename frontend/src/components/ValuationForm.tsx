import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FormPropertyData {
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  yearBuilt: string;
  propertyType: string;
  condition: string;
}

interface ValuationFormProps {
  onEstimate: (data: FormPropertyData) => void;
  isLoading: boolean;
}

export const ValuationForm = ({ onEstimate, isLoading }: ValuationFormProps) => {
  const [formData, setFormData] = useState<FormPropertyData>({
    address: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    yearBuilt: "",
    propertyType: "",
    condition: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.address || !formData.bedrooms || !formData.bathrooms || !formData.sqft) {
      toast.error("Please fill in all required fields");
      return;
    }

    onEstimate(formData);
  };

  const handleChange = (field: keyof FormPropertyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="valuation-form" className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-elevated bg-gradient-card border-0">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl md:text-4xl font-bold text-foreground">
              Property Valuation
            </CardTitle>
            <CardDescription className="text-lg">
              Enter your property details for an instant AI-powered price estimate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-base font-semibold">Property Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State ZIP"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  disabled={isLoading}
                  className="h-12 text-base"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="text-base font-semibold">Bedrooms *</Label>
                  <Select 
                    value={formData.bedrooms} 
                    onValueChange={(value) => handleChange("bedrooms", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-12" id="bedrooms">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="text-base font-semibold">Bathrooms *</Label>
                  <Select 
                    value={formData.bathrooms} 
                    onValueChange={(value) => handleChange("bathrooms", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-12" id="bathrooms">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sqft" className="text-base font-semibold">Square Feet *</Label>
                  <Input
                    id="sqft"
                    type="number"
                    placeholder="2000"
                    value={formData.sqft}
                    onChange={(e) => handleChange("sqft", e.target.value)}
                    disabled={isLoading}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearBuilt" className="text-base font-semibold">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    placeholder="2020"
                    value={formData.yearBuilt}
                    onChange={(e) => handleChange("yearBuilt", e.target.value)}
                    disabled={isLoading}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="text-base font-semibold">Property Type</Label>
                  <Select 
                    value={formData.propertyType} 
                    onValueChange={(value) => handleChange("propertyType", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-12" id="propertyType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-family">Single Family</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="multi-family">Multi-Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-base font-semibold">Condition</Label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(value) => handleChange("condition", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-12" id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
                    Get Valuation Estimate
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

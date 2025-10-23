import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function formatCurrency(value: number) {
  if (!isFinite(value)) return "-";
  return value.toLocaleString(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

export const EMICalculator = () => {
  const [principal, setPrincipal] = useState("5000000");
  const [annualRate, setAnnualRate] = useState("8.5");
  const [tenureYears, setTenureYears] = useState("20");
  const [downPayment, setDownPayment] = useState("0");

  const { emi, totalPayment, totalInterest, months } = useMemo(() => {
    const p = Math.max(0, Number(principal) - Number(downPayment || 0));
    const n = Math.max(1, Math.round(Number(tenureYears) * 12));
    const r = Math.max(0, Number(annualRate) / 12 / 100);

    const factor = Math.pow(1 + r, n);
    const emiVal = r === 0 ? p / n : (p * r * factor) / (factor - 1);
    const totalPay = emiVal * n;
    const interest = totalPay - p;

    return { emi: emiVal, totalPayment: totalPay, totalInterest: interest, months: n };
  }, [principal, annualRate, tenureYears, downPayment]);

  const handleReset = () => {
    setPrincipal("5000000");
    setAnnualRate("8.5");
    setTenureYears("20");
    setDownPayment("0");
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-elevated">
      <CardHeader>
        <CardTitle>Home Loan EMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Property Price / Principal (₹)</Label>
            <Input id="principal" type="number" min={0} value={principal} onChange={(e) => setPrincipal(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="down">Down Payment (₹)</Label>
            <Input id="down" type="number" min={0} value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Annual Interest Rate (%)</Label>
            <Input id="rate" type="number" step="0.01" min={0} value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenure">Tenure (years)</Label>
            <Input id="tenure" type="number" min={1} value={tenureYears} onChange={(e) => setTenureYears(e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={handleReset} variant="outline">Reset</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-6 bg-white/70 dark:bg-white/10 border border-border/60">
            <div className="text-sm text-muted-foreground">Monthly EMI</div>
            <div className="text-3xl font-bold">{formatCurrency(Math.round(emi))}</div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Total Payment ({months} months)</div>
                <div className="font-semibold">{formatCurrency(Math.round(totalPayment))}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Interest</div>
                <div className="font-semibold">{formatCurrency(Math.round(totalInterest))}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

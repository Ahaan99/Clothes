import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Pricing() {
  const tiers = [
    {
      name: "Individual",
      price: "19.99",
      priceDetail: "per item",
      description: "Perfect for personal custom designs",
      features: [
        "High-quality fabric printing",
        "Up to 3 colors per design",
        "Basic design templates",
        "Standard delivery (5-7 days)",
        "Single item orders",
        "Free size customization"
      ],
      popular: false,
      minimumOrder: "No minimum order"
    },
    {
      name: "Small Team",
      price: "16.99",
      priceDetail: "per item",
      description: "Great for small groups and teams",
      features: [
        "Premium quality printing",
        "Unlimited colors per design",
        "Team number printing",
        "Custom name printing",
        "Rush delivery available",
        "Bulk discount (10+ items)",
        "Free design consultation"
      ],
      popular: true,
      minimumOrder: "Minimum 10 items"
    },
    {
      name: "Business",
      price: "14.99",
      priceDetail: "per item",
      description: "Ideal for large orders and businesses",
      features: [
        "Professional grade printing",
        "Advanced customization options",
        "Priority production",
        "Dedicated account manager",
        "Bulk pricing (25+ items)",
        "Free shipping",
        "Sample product option",
        "Express delivery (2-3 days)"
      ],
      popular: false,
      minimumOrder: "Minimum 25 items"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Clothing Print Pricing</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Quality custom printing for every scale - from individual pieces to bulk orders
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tiers.map((tier) => (
          <Card 
            key={tier.name}
            className={`relative ${
              tier.popular ? 'border-primary shadow-lg scale-105' : ''
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader className="text-center">
              <CardTitle>
                <h3 className="text-2xl font-bold">{tier.name}</h3>
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-gray-600 ml-1">{tier.priceDetail}</span>
              </div>
              <p className="text-gray-600 mt-2">{tier.description}</p>
              <p className="text-sm font-medium text-primary mt-2">{tier.minimumOrder}</p>
            </CardHeader>

            <CardContent>
              <ul className="space-y-4 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full" 
                variant={tier.popular ? "default" : "outline"}
              >
                Start Order
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
        <div>
          <h3 className="font-semibold mb-2">Custom Bulk Orders</h3>
          <p className="text-gray-600">Need more than 100 items? Contact us for special wholesale pricing.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Design Service</h3>
          <p className="text-gray-600">Professional design service available for all packages at additional cost.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Rush Orders</h3>
          <p className="text-gray-600">Need it faster? Ask about our rush order options.</p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Need a Custom Quote?</h2>
        <p className="text-gray-600 mb-6">
          Get in touch for special requirements or bulk orders over 100 items
        </p>
        <Button variant="outline" size="lg">
          Contact Sales
        </Button>
      </div>
    </div>
  );
}

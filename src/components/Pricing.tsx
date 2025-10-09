import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Launch Package",
    price: "$249",
    period: "one-time",
    description: "Everything you need for a complete product launch",
    features: [
      "5 YouTube Shorts scripts",
      "3 Instagram carousels (Canva)",
      "5-email nurture sequence",
      "FAQ & documentation (20+ questions)",
      "AI support agent setup",
      "All assets delivered in 60 minutes",
      "Export to Google Docs & Markdown",
      "Downloadable ZIP with all files",
    ],
    cta: "Get Launch Package",
    popular: true,
  },
  {
    name: "Support & Updates",
    price: "$29",
    period: "per month",
    description: "Keep your launch assets fresh and your chatbot learning",
    features: [
      "Monthly content updates",
      "AI agent retraining",
      "New channel additions",
      "Content performance insights",
      "Priority email support",
      "A/B testing for hooks & CTAs",
      "Cancel anytime",
    ],
    cta: "Add Support Plan",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-4 relative scroll-mt-24">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="animate-fade-up">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Launch once, or keep growing with ongoing support. Your choice.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`p-8 glass hover:shadow-elevated transition-smooth animate-fade-up relative ${
                plan.popular ? 'border-primary shadow-glow' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full gradient-primary text-primary-foreground text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  size="lg" 
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="text-center mt-12 space-y-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-muted-foreground">
            All payments processed securely through Stripe. Cancel support plan anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

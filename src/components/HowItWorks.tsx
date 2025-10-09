import { Card } from "@/components/ui/card";
import { ClipboardCheck, Sparkles, Package, Rocket } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Fill the Form",
    description: "Tell us about your product, audience, brand, and channels. Takes 5-10 minutes.",
    time: "5-10 min",
  },
  {
    icon: Sparkles,
    title: "AI Generation",
    description: "Our AI creates personalized content for all channels while you grab coffee.",
    time: "20-30 min",
  },
  {
    icon: Package,
    title: "Review & Download",
    description: "Get access to all assets, Canva designs, and your AI support agent.",
    time: "5 min",
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "Deploy your content across channels and start growing your audience.",
    time: "You're live!",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 relative scroll-mt-24">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="animate-fade-up">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
            From form to launch in four simple steps. No complicated setup, no technical skills needed.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card 
                className="p-6 glass hover:shadow-elevated transition-smooth animate-fade-up h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4">
                  {/* Step number */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-muted">
                      {step.time}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">Step {index + 1}</span>
                    </div>
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </Card>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

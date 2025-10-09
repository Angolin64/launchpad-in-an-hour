import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Rocket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">CreatorLaunch</span>
          </div>

          {/* Nav links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-smooth">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-smooth">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-smooth">
              Pricing
            </a>
            <a href="#examples" className="text-sm font-medium hover:text-primary transition-smooth">
              Examples
            </a>
          </div>

          {/* CTA */}
          <Button variant="hero">
            Start Launch
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

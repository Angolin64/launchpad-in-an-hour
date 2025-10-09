import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (anchor: string) => {
    if (location.pathname !== '/') {
      navigate('/' + anchor);
    } else {
      const element = document.getElementById(anchor.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Rocket className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">CreatorLaunch</span>
          </Link>

          {/* Nav links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('#features')}
              className="text-sm font-medium hover:text-primary transition-smooth"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('#how-it-works')}
              className="text-sm font-medium hover:text-primary transition-smooth"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('#pricing')}
              className="text-sm font-medium hover:text-primary transition-smooth"
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavClick('#examples')}
              className="text-sm font-medium hover:text-primary transition-smooth"
            >
              Examples
            </button>
          </div>

          {/* CTA */}
          <Link to="/launch">
            <Button variant="hero">
              Start Launch
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

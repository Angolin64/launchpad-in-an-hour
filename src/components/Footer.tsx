import { Link } from "react-router-dom";
import logo from "@/assets/launchin60.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Launchin60" className="h-32" />
            </div>
            <p className="text-sm text-muted-foreground">
              Launch your product in under 60 minutes with AI-powered marketing packages.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-smooth">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-smooth">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-smooth">Pricing</a></li>
              <li><a href="#examples" className="hover:text-foreground transition-smooth">Examples</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#docs" className="hover:text-foreground transition-smooth">Documentation</a></li>
              <li><a href="#blog" className="hover:text-foreground transition-smooth">Blog</a></li>
              <li><a href="#support" className="hover:text-foreground transition-smooth">Support</a></li>
              <li><a href="#api" className="hover:text-foreground transition-smooth">API</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#privacy" className="hover:text-foreground transition-smooth">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-foreground transition-smooth">Terms of Service</a></li>
              <li><a href="#data" className="hover:text-foreground transition-smooth">Data Handling</a></li>
              <li><a href="#compliance" className="hover:text-foreground transition-smooth">Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Launchin60. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#twitter" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              Twitter
            </a>
            <a href="#linkedin" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              LinkedIn
            </a>
            <a href="#github" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

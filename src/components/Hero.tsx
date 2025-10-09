import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="Creative workspace" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Launch your product in under 60 minutes</span>
          </div>

          {/* Main heading */}
          <h1 className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            From Idea to Launch
            <br />
            <span className="text-primary font-bold">
              In One Hour
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Get a complete automated launch package for your product: YouTube scripts, Instagram carousels, email sequences, FAQs, and an AI support agent—all generated and ready to deploy.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl">
              Start Your Launch
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl">
              See How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">60min</div>
              <div className="text-sm text-muted-foreground">Complete Launch Package</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">Marketing Channels</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">100%</div>
              <div className="text-sm text-muted-foreground">Ready to Deploy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  );
};

export default Hero;

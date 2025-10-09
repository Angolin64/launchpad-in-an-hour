import { Card } from "@/components/ui/card";
import { Video, Image, Mail, MessageSquare, FileText, Zap } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "YouTube Shorts Scripts",
    description: "5 engaging scripts with hooks, value delivery, and clear CTAs. 30-45 seconds, optimized for maximum retention.",
  },
  {
    icon: Image,
    title: "Instagram Carousels",
    description: "3 stunning carousels with 8-10 slides each. Editable Canva designs with your brand colors and fonts.",
  },
  {
    icon: Mail,
    title: "Email Sequences",
    description: "5-email nurture sequence with compelling subject lines, previews, bodies, and conversion-focused CTAs.",
  },
  {
    icon: FileText,
    title: "FAQ & Documentation",
    description: "20+ common questions answered clearly, organized by sections for easy navigation.",
  },
  {
    icon: MessageSquare,
    title: "AI Support Agent",
    description: "Pre-trained chatbot with all your product knowledge, ready to embed on your site immediately.",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Complete package delivered in under 60 minutes. Download assets, get Canva links, and deploy.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="animate-fade-up">
            Everything You Need to Launch
          </h2>
          <p className="text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
            A complete marketing package across all major channels, personalized to your brand and ready to deploy.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 glass hover:shadow-elevated transition-smooth animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

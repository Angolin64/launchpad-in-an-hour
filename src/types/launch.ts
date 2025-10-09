export interface ProductInfo {
  name: string;
  description: string;
  price: string;
  features: string[];
  differentiators: string;
}

export interface AudienceInfo {
  niche: string;
  painPoints: string[];
  goals: string[];
  language: string;
  objections: string[];
}

export interface BrandInfo {
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'playful';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fonts: string;
  logoUrl: string;
}

export interface ChannelsInfo {
  youtube: boolean;
  instagram: boolean;
  email: boolean;
  faq: boolean;
  chatbot: boolean;
}

export interface SupportInfo {
  policies: string;
  pricingDetails: string;
  onboardingSteps: string[];
  tutorialLinks: string[];
}

export interface ConsentInfo {
  aiTrainingConsent: boolean;
}

export interface LaunchFormData {
  product: ProductInfo;
  audience: AudienceInfo;
  brand: BrandInfo;
  channels: ChannelsInfo;
  support: SupportInfo;
  consent: ConsentInfo;
}

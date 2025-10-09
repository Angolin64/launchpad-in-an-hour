import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  price: z.string().min(1, "Price is required"),
  features: z.array(z.string().min(1)).min(1, "At least one feature is required"),
  differentiators: z.string().min(10, "Differentiators must be at least 10 characters").max(500),
});

export const audienceSchema = z.object({
  niche: z.string().min(1, "Niche is required").max(100),
  painPoints: z.array(z.string().min(1)).min(1, "At least one pain point is required"),
  goals: z.array(z.string().min(1)).min(1, "At least one goal is required"),
  language: z.string().min(1, "Language is required"),
  objections: z.array(z.string().min(1)).min(1, "At least one objection is required"),
});

export const brandSchema = z.object({
  tone: z.enum(['professional', 'casual', 'friendly', 'authoritative', 'playful']),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  fonts: z.string().min(1, "Font family is required"),
  logoUrl: z.string().url("Must be a valid URL").or(z.literal("")),
});

export const channelsSchema = z.object({
  youtube: z.boolean(),
  instagram: z.boolean(),
  email: z.boolean(),
  faq: z.boolean(),
  chatbot: z.boolean(),
}).refine(data => Object.values(data).some(v => v === true), {
  message: "At least one channel must be selected",
});

export const supportSchema = z.object({
  policies: z.string().min(10, "Policies must be at least 10 characters").max(2000),
  pricingDetails: z.string().min(10, "Pricing details must be at least 10 characters").max(1000),
  onboardingSteps: z.array(z.string().min(1)).min(1, "At least one onboarding step is required"),
  tutorialLinks: z.array(z.string().url("Must be a valid URL")),
});

export const consentSchema = z.object({
  aiTrainingConsent: z.boolean().refine(val => val === true, {
    message: "You must consent to AI training to continue",
  }),
});

export const launchFormSchema = z.object({
  product: productSchema,
  audience: audienceSchema,
  brand: brandSchema,
  channels: channelsSchema,
  support: supportSchema,
  consent: consentSchema,
});

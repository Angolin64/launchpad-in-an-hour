import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LaunchFormData } from "@/types/launch";
import { launchFormSchema } from "@/lib/formSchema";
import { Button } from "@/components/ui/button";
import { FormProgress } from "@/components/launch/FormProgress";
import { StepProduct } from "@/components/launch/StepProduct";
import { StepAudience } from "@/components/launch/StepAudience";
import { StepBrand } from "@/components/launch/StepBrand";
import { StepChannels } from "@/components/launch/StepChannels";
import { StepSupport } from "@/components/launch/StepSupport";
import { StepConsent } from "@/components/launch/StepConsent";
import { StepReview } from "@/components/launch/StepReview";
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "launchkit_form_data";

const stepLabels = ["Product", "Audience", "Brand", "Channels", "Support", "Consent", "Review"];

const Launch = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const form = useForm<LaunchFormData>({
    resolver: zodResolver(launchFormSchema),
    defaultValues: {
      product: {
        name: "",
        description: "",
        price: "",
        features: [],
        differentiators: "",
      },
      audience: {
        niche: "",
        painPoints: [],
        goals: [],
        language: "",
        objections: [],
      },
      brand: {
        tone: "professional",
        primaryColor: "#6B46C1",
        secondaryColor: "#38B2AC",
        accentColor: "#ED8936",
        fonts: "",
        logoUrl: "",
      },
      channels: {
        youtube: false,
        instagram: false,
        email: false,
        faq: false,
        chatbot: false,
      },
      support: {
        policies: "",
        pricingDetails: "",
        onboardingSteps: [],
        tutorialLinks: [],
      },
      consent: {
        aiTrainingConsent: false,
      },
    },
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        form.reset(data);
      } catch (e) {
        console.error("Failed to load saved form data", e);
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const validateCurrentStep = async () => {
    const stepFields: Record<number, keyof LaunchFormData> = {
      0: "product",
      1: "audience",
      2: "brand",
      3: "channels",
      4: "support",
      5: "consent",
    };

    const field = stepFields[currentStep];
    if (!field) return true;

    const result = await form.trigger(field as any);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, stepLabels.length - 1));
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a project.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      // Create project in database
      const { data: project, error } = await supabase
        .from("projects")
        .insert([{
          user_id: user.id,
          name: data.product.name,
          form_data: data as any,
          status: "pending",
        }])
        .select()
        .single();

      if (error) throw error;

      // Create initial generation status entries for selected channels
      const statusEntries = [];
      if (data.channels.youtube) statusEntries.push({ project_id: project.id, content_type: "youtube" });
      if (data.channels.instagram) statusEntries.push({ project_id: project.id, content_type: "instagram" });
      if (data.channels.email) statusEntries.push({ project_id: project.id, content_type: "email" });
      if (data.channels.faq) statusEntries.push({ project_id: project.id, content_type: "faq" });
      if (data.channels.chatbot) statusEntries.push({ project_id: project.id, content_type: "chatbot" });

      if (statusEntries.length > 0) {
        const { error: statusError } = await supabase
          .from("generation_status")
          .insert(statusEntries);

        if (statusError) throw statusError;
      }

      toast({
        title: "Launch Initiated! 🚀",
        description: "Redirecting to your project dashboard...",
      });
      
      localStorage.removeItem(STORAGE_KEY);
      
      // Trigger content generation in the background
      supabase.functions.invoke('generate-content', {
        body: { projectId: project.id }
      }).catch(err => console.error('Background generation error:', err));
      
      navigate(`/project/${project.id}`);
    } catch (error: any) {
      toast({
        title: "Error Creating Project",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepProduct form={form} />;
      case 1:
        return <StepAudience form={form} />;
      case 2:
        return <StepBrand form={form} />;
      case 3:
        return <StepChannels form={form} />;
      case 4:
        return <StepSupport form={form} />;
      case 5:
        return <StepConsent form={form} />;
      case 6:
        return <StepReview form={form} onEditStep={setCurrentStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
              Launch Your Product
            </h1>
            <p className="text-muted-foreground">
              Complete this form to generate your marketing content across all channels
            </p>
          </div>

          <div className="glass rounded-2xl p-6 md:p-8 shadow-elevated">
            <FormProgress
              currentStep={currentStep}
              totalSteps={stepLabels.length}
              stepLabels={stepLabels}
            />

            <form onSubmit={handleSubmit} className="mt-8">
              {renderStep()}

              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < stepLabels.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" className="gradient-primary">
                    <Rocket className="w-4 h-4 mr-2" />
                    Launch Now
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Launch;

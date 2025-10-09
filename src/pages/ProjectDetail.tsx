import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Download, Rocket, Eye, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { YouTubePreview } from "@/components/preview/YouTubePreview";
import { InstagramPreview } from "@/components/preview/InstagramPreview";
import { EmailPreview } from "@/components/preview/EmailPreview";
import { FAQPreview } from "@/components/preview/FAQPreview";
import { ChatbotPreview } from "@/components/preview/ChatbotPreview";

interface GenerationStatus {
  id: string;
  content_type: string;
  status: string;
  progress: number;
  error_message: string | null;
  estimated_time_remaining: number | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
  form_data: any;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [statuses, setStatuses] = useState<GenerationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [previewType, setPreviewType] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadProjectData();
        
        // Set up realtime subscription for status updates
        const channel = supabase
          .channel('project-status-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'generation_status',
              filter: `project_id=eq.${id}`,
            },
            (payload) => {
              console.log('Status update:', payload);
              loadProjectData();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    });
  }, [id, navigate]);

  const loadProjectData = async () => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      const { data: statusData, error: statusError } = await supabase
        .from("generation_status")
        .select("*")
        .eq("project_id", id);

      if (statusError) throw statusError;
      setStatuses(statusData || []);
    } catch (error: any) {
      toast({
        title: "Error loading project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async (contentType: string) => {
    try {
      // Update status to pending
      await supabase
        .from('generation_status')
        .update({ 
          status: 'pending', 
          progress: 0, 
          error_message: null 
        })
        .eq('project_id', id)
        .eq('content_type', contentType);

      // Trigger regeneration
      const { error } = await supabase.functions.invoke('generate-content', {
        body: { projectId: id }
      });

      if (error) throw error;

      toast({
        title: "Regeneration started",
        description: `Regenerating ${contentType} content...`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePreview = async (contentType: string) => {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('content')
        .eq('project_id', id)
        .eq('content_type', contentType)
        .single();

      if (error) throw error;

      setPreviewContent(data.content);
      setPreviewType(contentType);
      setShowPreview(true);
    } catch (error: any) {
      toast({
        title: "Error loading preview",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCanvaExport = async (contentType: string) => {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('content')
        .eq('project_id', id)
        .eq('content_type', contentType)
        .single();

      if (error) throw error;

      toast({
        title: "Creating Canva design...",
        description: "Opening Canva with your content",
      });

      const { data: canvaData, error: canvaError } = await supabase.functions.invoke('canva-export', {
        body: {
          contentType,
          content: data.content,
          projectName: project?.name || 'Untitled Project',
        }
      });

      if (canvaError) throw canvaError;

      if (canvaData?.editUrl) {
        // Open Canva in a new tab
        window.open(canvaData.editUrl, '_blank');
        
        toast({
          title: "Design created!",
          description: "Your Canva design has been opened in a new tab",
        });
      }
    } catch (error: any) {
      toast({
        title: "Canva export failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (contentType: string, format: 'json' | 'txt' | 'csv') => {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('content')
        .eq('project_id', id)
        .eq('content_type', contentType)
        .single();

      if (error) throw error;

      let blob: Blob;
      let filename: string;

      if (format === 'json') {
        blob = new Blob([JSON.stringify(data.content, null, 2)], {
          type: 'application/json',
        });
        filename = `${contentType}-${new Date().getTime()}.json`;
      } else if (format === 'txt') {
        const textContent = formatContentAsText(data.content, contentType);
        blob = new Blob([textContent], { type: 'text/plain' });
        filename = `${contentType}-${new Date().getTime()}.txt`;
      } else {
        const csvContent = formatContentAsCSV(data.content, contentType);
        blob = new Blob([csvContent], { type: 'text/csv' });
        filename = `${contentType}-${new Date().getTime()}.csv`;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `Your content is being downloaded as ${format.toUpperCase()}.`,
      });
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatContentAsText = (content: any, contentType: string): string => {
    let text = `${contentTypeLabels[contentType]}\n${'='.repeat(50)}\n\n`;

    if (contentType === 'youtube') {
      content.scripts?.forEach((script: any, i: number) => {
        text += `Short #${i + 1}\n`;
        text += `Hook: ${script.hook}\n`;
        text += `Content: ${script.content}\n`;
        text += `CTA: ${script.cta}\n`;
        text += `Hashtags: ${script.hashtags?.join(' ')}\n\n`;
      });
    } else if (contentType === 'instagram') {
      content.carousels?.forEach((carousel: any, i: number) => {
        text += `Carousel #${i + 1}\n`;
        carousel.slides?.forEach((slide: any, j: number) => {
          text += `  Slide ${j + 1}: ${slide.text}\n`;
        });
        text += `Caption: ${carousel.caption}\n\n`;
      });
    } else if (contentType === 'email') {
      content.emails?.forEach((email: any, i: number) => {
        text += `Email #${i + 1}\n`;
        text += `Subject: ${email.subject}\n`;
        text += `Preview: ${email.preview}\n`;
        text += `Body:\n${email.body}\n\n`;
      });
    } else if (contentType === 'faq') {
      content.faqs?.forEach((faq: any, i: number) => {
        text += `Q${i + 1}: ${faq.question}\n`;
        text += `A: ${faq.answer}\n\n`;
      });
    } else if (contentType === 'chatbot') {
      text += `Greeting: ${content.greeting}\n\n`;
      text += `Product Info:\n${JSON.stringify(content.product_info, null, 2)}\n\n`;
      text += `Common Questions:\n`;
      content.common_questions?.forEach((qa: any, i: number) => {
        text += `Q${i + 1}: ${qa.question}\nA: ${qa.answer}\n\n`;
      });
    }

    return text;
  };

  const formatContentAsCSV = (content: any, contentType: string): string => {
    let csv = '';

    if (contentType === 'youtube') {
      csv = 'Number,Hook,Content,CTA,Hashtags\n';
      content.scripts?.forEach((script: any, i: number) => {
        csv += `${i + 1},"${script.hook.replace(/"/g, '""')}","${script.content.replace(/"/g, '""')}","${script.cta.replace(/"/g, '""')}","${script.hashtags?.join(' ')}"\n`;
      });
    } else if (contentType === 'email') {
      csv = 'Number,Subject,Preview,Body,CTA\n';
      content.emails?.forEach((email: any, i: number) => {
        csv += `${i + 1},"${email.subject.replace(/"/g, '""')}","${email.preview.replace(/"/g, '""')}","${email.body.replace(/"/g, '""')}","${email.cta?.replace(/"/g, '""') || ''}"\n`;
      });
    } else if (contentType === 'faq') {
      csv = 'Number,Question,Answer\n';
      content.faqs?.forEach((faq: any, i: number) => {
        csv += `${i + 1},"${faq.question.replace(/"/g, '""')}","${faq.answer.replace(/"/g, '""')}"\n`;
      });
    } else {
      csv = 'Content\n';
      csv += `"${JSON.stringify(content).replace(/"/g, '""')}"\n`;
    }

    return csv;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "default";
      case "processing":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  const contentTypeLabels: Record<string, string> = {
    youtube: "YouTube Shorts Scripts",
    instagram: "Instagram Carousels",
    email: "Email Sequence",
    faq: "FAQ & Documentation",
    chatbot: "AI Support Agent",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="glass p-8 text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Rocket className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">CreatorLaunch</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">{project.name}</h1>
              <Badge variant={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Track the progress of your content generation
            </p>
          </div>

          {statuses.length === 0 ? (
            <Card className="glass text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">
                  No content generation in progress. This will be populated once generation starts.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {statuses.map((status) => (
                <Card key={status.id} className="glass">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {contentTypeLabels[status.content_type] || status.content_type}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(status.status)}>
                          {status.status}
                        </Badge>
                        {status.status === "complete" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePreview(status.content_type)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleDownload(status.content_type, 'json')}>
                                  Download as JSON
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(status.content_type, 'txt')}>
                                  Download as TXT
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(status.content_type, 'csv')}>
                                  Download as CSV
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCanvaExport(status.content_type)}
                            >
                              <Palette className="w-4 h-4 mr-2" />
                              Design in Canva
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRegenerate(status.content_type)}
                          disabled={status.status === 'processing'}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{status.progress}%</span>
                      </div>
                      <Progress value={status.progress} />
                    </div>
                    {status.estimated_time_remaining && (
                      <p className="text-sm text-muted-foreground">
                        Estimated time remaining: {Math.ceil(status.estimated_time_remaining / 60)} minutes
                      </p>
                    )}
                    {status.error_message && (
                      <p className="text-sm text-destructive">
                        Error: {status.error_message}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {contentTypeLabels[previewType] || previewType}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {previewType === 'youtube' && previewContent && (
              <YouTubePreview content={previewContent} />
            )}
            {previewType === 'instagram' && previewContent && (
              <InstagramPreview content={previewContent} />
            )}
            {previewType === 'email' && previewContent && (
              <EmailPreview content={previewContent} />
            )}
            {previewType === 'faq' && previewContent && (
              <FAQPreview content={previewContent} />
            )}
            {previewType === 'chatbot' && previewContent && (
              <ChatbotPreview content={previewContent} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Download, Rocket, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

  const handleDownload = async (contentType: string) => {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('content')
        .eq('project_id', id)
        .eq('content_type', contentType)
        .single();

      if (error) throw error;

      // Create downloadable file
      const blob = new Blob([JSON.stringify(data.content, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contentType}-content.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `${contentType} content downloaded successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error downloading",
        description: error.message,
        variant: "destructive",
      });
    }
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(status.content_type)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {contentTypeLabels[previewType] || previewType} Preview
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(previewContent, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;

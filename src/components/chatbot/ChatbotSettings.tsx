import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Palette, MessageSquare, Mic, Settings as SettingsIcon } from "lucide-react";

interface ChatbotConfig {
  id?: string;
  project_id: string;
  theme_color: string;
  bot_name: string;
  bot_avatar_url?: string;
  position: string;
  chat_bubble_size: string;
  greeting_message: string;
  auto_open: boolean;
  show_typing_indicator: boolean;
  response_style: string;
  voice_enabled: boolean;
  voice_name: string;
  auto_speak_responses: boolean;
  ai_model: string;
  temperature: number;
  max_tokens: number;
  conversation_memory_enabled: boolean;
  file_upload_enabled: boolean;
  company_name?: string;
  company_logo_url?: string;
}

interface ChatbotSettingsProps {
  projectId: string;
}

export const ChatbotSettings = ({ projectId }: ChatbotSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<ChatbotConfig>({
    project_id: projectId,
    theme_color: '#8B5CF6',
    bot_name: 'AI Assistant',
    position: 'bottom-right',
    chat_bubble_size: 'large',
    greeting_message: 'Hello! How can I help you today?',
    auto_open: false,
    show_typing_indicator: true,
    response_style: 'friendly',
    voice_enabled: false,
    voice_name: 'alloy',
    auto_speak_responses: false,
    ai_model: 'google/gemini-2.5-flash',
    temperature: 0.7,
    max_tokens: 500,
    conversation_memory_enabled: true,
    file_upload_enabled: false,
  });

  useEffect(() => {
    loadConfig();
  }, [projectId]);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('chatbot_config')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setConfig(data);
      }
    } catch (error: any) {
      console.error('Error loading config:', error);
      toast({
        title: "Error",
        description: "Failed to load chatbot configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('chatbot_config')
        .upsert({
          ...config,
          project_id: projectId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Chatbot configuration saved successfully",
      });
    } catch (error: any) {
      console.error('Error saving config:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key: keyof ChatbotConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Chatbot Configuration</h2>
          <p className="text-muted-foreground">Customize your chatbot's appearance and behavior</p>
        </div>
        <Button onClick={saveConfig} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Behavior
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Settings</CardTitle>
              <CardDescription>Customize how your chatbot looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bot_name">Bot Name</Label>
                <Input
                  id="bot_name"
                  value={config.bot_name}
                  onChange={(e) => updateConfig('bot_name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme_color">Theme Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="theme_color"
                    type="color"
                    value={config.theme_color}
                    onChange={(e) => updateConfig('theme_color', e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    value={config.theme_color}
                    onChange={(e) => updateConfig('theme_color', e.target.value)}
                    placeholder="#8B5CF6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select value={config.position} onValueChange={(value) => updateConfig('position', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chat_bubble_size">Chat Bubble Size</Label>
                <Select value={config.chat_bubble_size} onValueChange={(value) => updateConfig('chat_bubble_size', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={config.company_name || ''}
                  onChange={(e) => updateConfig('company_name', e.target.value)}
                  placeholder="Your Company"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Behavior Settings</CardTitle>
              <CardDescription>Configure how your chatbot behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="greeting_message">Greeting Message</Label>
                <Textarea
                  id="greeting_message"
                  value={config.greeting_message}
                  onChange={(e) => updateConfig('greeting_message', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="response_style">Response Style</Label>
                <Select value={config.response_style} onValueChange={(value) => updateConfig('response_style', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Open</Label>
                  <p className="text-sm text-muted-foreground">Open chat automatically when page loads</p>
                </div>
                <Switch
                  checked={config.auto_open}
                  onCheckedChange={(checked) => updateConfig('auto_open', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Typing Indicator</Label>
                  <p className="text-sm text-muted-foreground">Display typing animation when bot is responding</p>
                </div>
                <Switch
                  checked={config.show_typing_indicator}
                  onCheckedChange={(checked) => updateConfig('show_typing_indicator', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Conversation Memory</Label>
                  <p className="text-sm text-muted-foreground">Remember conversation context</p>
                </div>
                <Switch
                  checked={config.conversation_memory_enabled}
                  onCheckedChange={(checked) => updateConfig('conversation_memory_enabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice Settings</CardTitle>
              <CardDescription>Enable and configure voice capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Voice</Label>
                  <p className="text-sm text-muted-foreground">Allow voice input and output</p>
                </div>
                <Switch
                  checked={config.voice_enabled}
                  onCheckedChange={(checked) => updateConfig('voice_enabled', checked)}
                />
              </div>

              {config.voice_enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="voice_name">Voice</Label>
                    <Select value={config.voice_name} onValueChange={(value) => updateConfig('voice_name', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alloy">Alloy</SelectItem>
                        <SelectItem value="ash">Ash</SelectItem>
                        <SelectItem value="ballad">Ballad</SelectItem>
                        <SelectItem value="coral">Coral</SelectItem>
                        <SelectItem value="echo">Echo</SelectItem>
                        <SelectItem value="sage">Sage</SelectItem>
                        <SelectItem value="shimmer">Shimmer</SelectItem>
                        <SelectItem value="verse">Verse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Speak Responses</Label>
                      <p className="text-sm text-muted-foreground">Automatically speak bot responses</p>
                    </div>
                    <Switch
                      checked={config.auto_speak_responses}
                      onCheckedChange={(checked) => updateConfig('auto_speak_responses', checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Fine-tune AI behavior and features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai_model">AI Model</Label>
                <Select value={config.ai_model} onValueChange={(value) => updateConfig('ai_model', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</SelectItem>
                    <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                    <SelectItem value="google/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</SelectItem>
                    <SelectItem value="openai/gpt-5-mini">GPT-5 Mini</SelectItem>
                    <SelectItem value="openai/gpt-5">GPT-5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Temperature: {config.temperature}</Label>
                <Slider
                  value={[config.temperature]}
                  onValueChange={(values) => updateConfig('temperature', values[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">Higher values make output more random</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_tokens">Max Tokens</Label>
                <Input
                  id="max_tokens"
                  type="number"
                  value={config.max_tokens}
                  onChange={(e) => updateConfig('max_tokens', parseInt(e.target.value))}
                  min={100}
                  max={2000}
                />
                <p className="text-sm text-muted-foreground">Maximum length of responses</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>File Upload</Label>
                  <p className="text-sm text-muted-foreground">Allow users to upload files</p>
                </div>
                <Switch
                  checked={config.file_upload_enabled}
                  onCheckedChange={(checked) => updateConfig('file_upload_enabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
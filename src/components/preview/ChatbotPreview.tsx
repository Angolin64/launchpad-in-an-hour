import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatbotPreviewProps {
  content: any;
}

export const ChatbotPreview = ({ content }: ChatbotPreviewProps) => {
  const { product_info, common_questions, greeting, fallback_response } = content;

  return (
    <ScrollArea className="h-[500px] pr-4">
      <Tabs defaultValue="greeting" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="greeting">Greeting</TabsTrigger>
          <TabsTrigger value="product">Product Info</TabsTrigger>
          <TabsTrigger value="questions">Q&A</TabsTrigger>
          <TabsTrigger value="fallback">Fallback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="greeting" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Bot Greeting</h3>
            <p className="text-sm">{greeting}</p>
          </Card>
        </TabsContent>

        <TabsContent value="product" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Product Knowledge</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(product_info || {}).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}: </span>
                  <span className="text-muted-foreground">{String(value)}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          {common_questions?.map((qa: any, index: number) => (
            <Card key={index} className="p-4">
              <h4 className="font-medium mb-2">{qa.question}</h4>
              <p className="text-sm text-muted-foreground">{qa.answer}</p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="fallback" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Fallback Response</h3>
            <p className="text-sm">{fallback_response}</p>
          </Card>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
};

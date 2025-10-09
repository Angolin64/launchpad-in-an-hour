import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InstagramPreviewProps {
  content: any;
}

export const InstagramPreview = ({ content }: InstagramPreviewProps) => {
  const carousels = content.carousels || [];

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        {carousels.map((carousel: any, index: number) => (
          <Card key={index} className="p-6">
            <h3 className="text-xl font-semibold mb-4">Carousel #{index + 1}</h3>
            <div className="space-y-4">
              {carousel.slides?.map((slide: any, slideIndex: number) => (
                <div key={slideIndex} className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium mb-2">Slide {slideIndex + 1}</h4>
                  <p className="text-sm mb-2">{slide.text}</p>
                  {slide.visual_suggestion && (
                    <p className="text-xs text-muted-foreground italic">Visual: {slide.visual_suggestion}</p>
                  )}
                </div>
              ))}
              {carousel.caption && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-muted-foreground mb-1">Caption</h4>
                  <p className="text-sm">{carousel.caption}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

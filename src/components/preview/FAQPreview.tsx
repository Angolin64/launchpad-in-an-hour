import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQPreviewProps {
  content: any;
}

export const FAQPreview = ({ content }: FAQPreviewProps) => {
  const faqs = content.faqs || [];

  return (
    <ScrollArea className="h-[500px] pr-4">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq: any, index: number) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </ScrollArea>
  );
};

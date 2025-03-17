import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const App = () => {
  return (
    <div className="space-y-4">
      <h1 className="bg-amber-400 text-amber-50">App</h1>
      <hr />
      <div>
        <Button>Click me</Button>
      </div>
      <hr />
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default App;

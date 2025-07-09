import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="bg-background border-b border-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">h</span>
            </div>
            <span className="text-xl font-semibold text-foreground">holori</span>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Button variant="default" className="bg-primary hover:bg-primary-hover">
              Compute
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Storage
            </Button>
          </nav>
        </div>

        <Button 
          variant="default" 
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          Visualize & optimize cloud spend
        </Button>
      </div>
    </header>
  );
}
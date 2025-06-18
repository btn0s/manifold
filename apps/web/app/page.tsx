import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { ArrowRight, Command, Layers } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <main className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <Badge variant="secondary" className="mb-4">
            For Freelancers & Software Studios
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight">
            Manifold
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage all your Linear workspaces from one place. 
            Access issues, create tasks, and stay organized across multiple client projects.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mt-12">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Command className="h-5 w-5" />
              <CardTitle>Raycast Extension</CardTitle>
            </div>
            <CardDescription>
              Quick access to all your Linear workspaces without leaving your keyboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Search issues across workspaces</li>
                  <li>• Create tasks with smart detection</li>
                  <li>• Quick workspace switching</li>
                  <li>• OAuth authentication</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Coming Soon</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Workspace aliases (@client1)</li>
                  <li>• Multi-workspace search</li>
                  <li>• Bulk operations</li>
                  <li>• Smart context switching</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted/50 rounded-lg p-8 space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Layers className="h-5 w-5" />
            <h3 className="text-lg font-semibold">How it works</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium">1. Connect Workspaces</div>
              <div className="text-muted-foreground">
                Authenticate with each Linear workspace using OAuth
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">2. Configure Aliases</div>
              <div className="text-muted-foreground">
                Set up shortcuts like @client1 or @personal for quick access
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium">3. Work Seamlessly</div>
              <div className="text-muted-foreground">
                Create and manage issues across all workspaces from one place
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="gap-2" asChild>
            <a href="https://www.raycast.com/store" target="_blank" rel="noopener noreferrer">
              Install Raycast Extension
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <a href="https://github.com/btn0s/manifold" target="_blank" rel="noopener noreferrer">
              View on GitHub
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Open source and available on GitHub
        </div>
      </main>
    </div>
  )
}

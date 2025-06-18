import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { ArrowRight, Command, Terminal, Layers } from "lucide-react";

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card>
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
              <ul className="text-sm text-muted-foreground text-left space-y-2">
                <li>• Search issues across all workspaces</li>
                <li>• Create tasks with smart workspace detection</li>
                <li>• Quick workspace switching with aliases</li>
                <li>• OAuth authentication for each workspace</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="h-5 w-5" />
                <CardTitle>MCP Server</CardTitle>
              </div>
              <CardDescription>
                Integrate Linear with AI assistants like Claude for automated workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground text-left space-y-2">
                <li>• Compatible with any MCP client</li>
                <li>• Full Linear API coverage</li>
                <li>• Secure credential management</li>
                <li>• Cross-workspace operations</li>
              </ul>
            </CardContent>
          </Card>
        </div>

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
          <Button size="lg" className="gap-2">
            Install Raycast Extension
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            View Documentation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Open source and available on GitHub
        </div>
      </main>
    </div>
  )
}

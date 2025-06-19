import Image from "next/image";
import {Button} from "@workspace/ui/components/button";
import {Badge} from "@workspace/ui/components/badge";
import {ArrowRight, Zap, Command, Layers, CheckCircle, Globe, Copy, Plus} from "lucide-react";

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5"/>
                <div className="relative">
                    <div className="container mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
                        <div className="mx-auto max-w-5xl text-center">
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    {/*<div className="absolute inset-0 blur-4xl bg-[#FF0000]/20 rounded-full" />*/}
                                    <div className="absolute inset-0 blur-2xl bg-[#FF0000] rounded-full"/>
                                    <Image
                                        src="/manifold-logo.png"
                                        alt="Manifold"
                                        width={120}
                                        height={120}

                                    />
                                </div>
                            </div>

                            <div className="relative w-fit h-fit mx-auto mb-6 rounded-md overflow-hidden bg-gradient-to-b from-[#FF0000] to-border p-px">
                                <div className="absolute h-4 w-full bg-[#FF0000] blur z-20 left-1/2 -translate-x-1/2 top-0 -translate-y-full"/>
                                <Badge variant="outline"
                                       className="px-4 py-1.5 text-sm font-medium overflow-hidden relative bg-background border-none">
                                    <Zap className="w-3 h-3 mr-1"/>
                                    For Freelancers & Software Studios
                                </Badge>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Raycast extension for Linear
                                <span className="block text-primary mt-2">across all your workspaces</span>
                            </h1>

                            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                A Raycast extension that connects all your Linear workspaces. Create tasks 
                                instantly from your command palette. Built for multi-client workflows.
                            </p>

                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="gap-2 text-base px-8" asChild>
                                    <a href="https://www.raycast.com/btn0s/manifold-linear" target="_blank"
                                       rel="noopener noreferrer">
                                        Install in Raycast
                                        <ArrowRight className="h-4 w-4"/>
                                    </a>
                                </Button>
                                <Button size="lg" variant="outline" className="gap-2 text-base px-8" asChild>
                                    <a href="https://github.com/btn0s/manifold" target="_blank"
                                       rel="noopener noreferrer">
                                        View Source
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Command palette meets Linear
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Raycast brings the power of keyboard shortcuts to Linear. Manage multiple workspaces without ever leaving your command palette.
                        </p>
                    </div>

                    <div className="bg-card rounded-2xl shadow-xl border p-8 sm:p-12">
                        <div className="grid gap-8 lg:grid-cols-2 items-center">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Command className="w-5 h-5 text-primary"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Native Raycast Experience</h3>
                                        <p className="text-muted-foreground">
                                            Launch with ⌘+Space. Search, navigate, and create—all
                                            within Raycast's familiar interface.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div
                                        className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Layers className="w-5 h-5 text-primary"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Multi-Workspace Management</h3>
                                        <p className="text-muted-foreground">
                                            Add all your Linear workspaces once. Switch between
                                            clients instantly without logging in and out.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div
                                        className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-primary"/>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Guided Task Creation</h3>
                                        <p className="text-muted-foreground">
                                            Step-by-step wizard walks you through workspace,
                                            project, title, and priority. Create tasks in seconds.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 blur-3xl"/>
                                <div
                                    className="relative bg-background/50 backdrop-blur border rounded-xl p-6 space-y-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Badge variant="secondary" className="px-2 py-0.5">Step 1</Badge>
                                        <span className="text-muted-foreground">Select Workspace</span>
                                    </div>
                                    <div className="space-y-2 pl-4">
                                        <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                                            <span className="font-medium">Acme Corp</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"/>
                                            <span className="font-medium">ThinkHuman</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"/>
                                            <span className="font-medium">Personal</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <div className="text-xs text-muted-foreground">
                                            Press Enter to continue →
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Everything you need, nothing you don't
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Built for professionals who value their time
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div
                            className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
                            <div className="mb-4">
                                <CheckCircle className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Success Confirmation</h3>
                            <p className="text-sm text-muted-foreground">
                                See your created issue details with URL auto-copied.
                                Open in Linear or create another—your choice.
                            </p>
                        </div>

                        <div
                            className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
                            <div className="mb-4">
                                <Globe className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Recent Issues View</h3>
                            <p className="text-sm text-muted-foreground">
                                See all recent issues across workspaces in one unified list.
                                Color-coded tags show which client at a glance.
                            </p>
                        </div>

                        <div
                            className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
                            <div className="mb-4">
                                <Copy className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Smart Clipboard</h3>
                            <p className="text-sm text-muted-foreground">
                                Issue URLs copied automatically on creation.
                                Paste anywhere—Slack, email, or your notes.
                            </p>
                        </div>

                        <div
                            className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
                            <div className="mb-4">
                                <Command className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Raycast Keyboard Shortcuts</h3>
                            <p className="text-sm text-muted-foreground">
                                Built for Raycast's keyboard-first philosophy. Navigate 
                                with arrows, select with Enter, skip with shortcuts.
                            </p>
                        </div>

                        <div
                            className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
                            <div className="mb-4">
                                <Layers className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Project Support</h3>
                            <p className="text-sm text-muted-foreground">
                                Optionally assign to projects. Skip if not needed—we
                                respect your workflow preferences.
                            </p>
                        </div>

                        <div
                            className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
                            <div className="mb-4">
                                <Plus className="h-8 w-8 text-primary"/>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">OAuth Security</h3>
                            <p className="text-sm text-muted-foreground">
                                Each workspace authenticated separately.
                                Your tokens stay local, never leave your machine.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Steps */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Add workspaces → Create tasks
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Simple wizard guides you through creating issues in any workspace
                        </p>
                    </div>

                    <div className="space-y-8">
                        {[
                            {
                                step: "1",
                                title: "Launch Command",
                                description: "Open Raycast and type 'Create Linear Issue'",
                                shortcut: "⌘ Space"
                            },
                            {
                                step: "2",
                                title: "Choose Workspace",
                                description: "Select from your connected Linear workspaces",
                                shortcut: "Arrow & Enter"
                            },
                            {
                                step: "3",
                                title: "Add Details",
                                description: "Title (required), description and project (optional)",
                                shortcut: "Type & Tab"
                            },
                            {
                                step: "4",
                                title: "Set Priority",
                                description: "Choose from urgent to low, or no priority",
                                shortcut: "Arrow & Enter"
                            },
                            {
                                step: "✓",
                                title: "Done!",
                                description: "Issue created, URL copied, ready to share",
                                shortcut: "Automatic"
                            }
                        ].map((item, index) => (
                            <div key={index} className="flex gap-6 items-start">
                                <div className="flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                    ${item.step === "✓"
                                        ? "bg-green-500/10 text-green-500 border-2 border-green-500/20"
                                        : "bg-primary/10 text-primary border-2 border-primary/20"}`}>
                                        {item.step}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-semibold">{item.title}</h3>
                                        <Badge variant="secondary" className="font-mono text-xs">
                                            {item.shortcut}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to supercharge Raycast with Linear?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join developers who manage multiple Linear workspaces directly from Raycast.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="gap-2 text-base px-8" asChild>
                            <a href="https://www.raycast.com/btn0s/manifold-linear" target="_blank"
                               rel="noopener noreferrer">
                                Install from Raycast Store
                                <ArrowRight className="h-4 w-4"/>
                            </a>
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                        Free Raycast extension • Open source • Works with your existing Linear accounts
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/manifold-logo.png"
                                alt="Manifold"
                                width={24}
                                height={24}
                                className="rounded"
                            />
                            <span className="font-semibold">Manifold for Raycast</span>
                        </div>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <a href="https://github.com/btn0s/manifold" target="_blank" rel="noopener noreferrer"
                               className="hover:text-foreground transition-colors">
                                GitHub
                            </a>
                            <a href="https://linear.app" target="_blank" rel="noopener noreferrer"
                               className="hover:text-foreground transition-colors">
                                Linear
                            </a>
                            <a href="https://raycast.com" target="_blank" rel="noopener noreferrer"
                               className="hover:text-foreground transition-colors">
                                Raycast
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

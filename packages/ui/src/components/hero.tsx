import React from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: {
    text: string;
    icon?: React.ReactNode;
  };
  primaryAction?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  children?: React.ReactNode;
}

export function Hero({
  title,
  subtitle,
  description,
  badge,
  primaryAction,
  secondaryAction,
  children,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5" />
      <div className="relative">
        <div className="container mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {children && (
              <div className="flex justify-center mb-8">
                {children}
              </div>
            )}
            
            {badge && (
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium">
                {badge.icon}
                {badge.text}
              </Badge>
            )}
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
              {subtitle && (
                <span className="block text-primary mt-2">{subtitle}</span>
              )}
            </h1>
            
            {description && (
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
            
            {(primaryAction || secondaryAction) && (
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                {primaryAction && (
                  <Button 
                    size="lg" 
                    className="gap-2 text-base px-8" 
                    asChild={!!primaryAction.href}
                  >
                    {primaryAction.href ? (
                      <a href={primaryAction.href} target="_blank" rel="noopener noreferrer">
                        {primaryAction.text}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <button onClick={primaryAction.onClick}>
                        {primaryAction.text}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </Button>
                )}
                {secondaryAction && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-2 text-base px-8" 
                    asChild={!!secondaryAction.href}
                  >
                    {secondaryAction.href ? (
                      <a href={secondaryAction.href} target="_blank" rel="noopener noreferrer">
                        {secondaryAction.text}
                      </a>
                    ) : (
                      <button onClick={secondaryAction.onClick}>
                        {secondaryAction.text}
                      </button>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
import { Crown, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function CreditsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        currentPage="credits"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center space-x-3">
              <Crown className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Credits</h1>
                <p className="text-muted-foreground">Meet the developer behind AI Mtaani</p>
              </div>
            </div>
          </div>
        </header>

      <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center">
              {/* Developer Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-white" />
              </div>
              
              {/* Developer Info */}
              <h2 className="text-2xl font-bold text-foreground mb-2">John Reese</h2>
              <p className="text-lg text-accent font-medium mb-4">Lead Developer & Founder</p>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Passionate software engineer from Kenya, dedicated to empowering developers worldwide 
                with AI-powered development tools.
              </p>
              
              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3 p-3 bg-muted rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">fsocietycipherrevolt@gmail.com</span>
                </div>
                
                <div className="flex items-center justify-center space-x-3 p-3 bg-muted rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">+254 745 282 166</span>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-accent/5 rounded-lg border border-primary/20">
                <h3 className="text-lg font-semibold text-foreground mb-3">Vision & Mission</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI Mtaani was born from the vision of democratizing software development through 
                  artificial intelligence. Our mission is to empower every developer, from beginners 
                  to experts, with tools that make coding more intuitive, faster, and more enjoyable.
                </p>
              </div>
              
              {/* Technologies Used */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">Built With</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "React", "TypeScript", "Node.js", "PostgreSQL", 
                    "OpenAI", "Google Gemini", "GitHub API", "WebSockets"
                  ].map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Powered by 👑 KingJohn Reese
          </div>
          <div className="text-xs text-muted-foreground">
            ©AI Mtaani 2025 All rights reserved
          </div>
        </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

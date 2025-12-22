import { Link } from "react-router-dom";
import { Lock, Unlock, Shield, Key, Image, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";

const features = [
  {
    icon: Image,
    title: "Image-Based Security",
    description: "Your BMP image becomes part of the encryption key - without the exact image, decryption is impossible.",
  },
  {
    icon: Key,
    title: "PBKDF2 Key Derivation",
    description: "100,000 iterations of PBKDF2 with SHA-256 creates an unbreakable key from your password and image.",
  },
  {
    icon: Shield,
    title: "AES-256-GCM Encryption",
    description: "Military-grade authenticated encryption ensures both confidentiality and integrity.",
  },
  {
    icon: Zap,
    title: "Client-Side Processing",
    description: "All encryption happens in your browser - your data never leaves your device.",
  },
];

const steps = [
  { number: "01", title: "Upload BMP", description: "Select any BMP image as your encryption key" },
  { number: "02", title: "Enter Password", description: "Add a secret password for extra security" },
  { number: "03", title: "Encrypt/Decrypt", description: "Process your message securely" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        <div className="container max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-8 animate-fade-in">
            <Shield className="h-4 w-4" />
            <span>Cryptographically Secure</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">BMP Image</span>
            <br />
            <span className="text-glow bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent">
              Cipher
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Transform any BMP image into an unbreakable encryption key. 
            Secure your messages with cutting-edge cryptography.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/encrypt">
              <Button variant="neon-solid" size="xl" className="gap-2 group">
                <Lock className="h-5 w-5" />
                Encrypt Message
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/decrypt">
              <Button variant="neon-green" size="xl" className="gap-2">
                <Unlock className="h-5 w-5" />
                Decrypt Message
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="text-primary text-glow">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to secure your communications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative group animate-fade-in"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <Card glow className="h-full bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <span className="font-display text-5xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                      {step.number}
                    </span>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Security <span className="text-accent text-glow-green">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built with industry-standard cryptographic primitives
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                glow
                className="bg-card/50 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-neon-green/5 box-glow-subtle">
            <CardContent className="p-8 sm:p-12 text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
                Ready to Secure Your Messages?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Start encrypting with the power of image-based cryptography. 
                No accounts, no tracking, complete privacy.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/encrypt">
                  <Button variant="cyber" size="lg" className="gap-2">
                    <Lock className="h-5 w-5" />
                    Start Encrypting
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/30">
        <div className="container max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <span className="text-primary">Web Crypto API</span>
            {" "}• PBKDF2 + AES-256-GCM
          </p>
        </div>
      </footer>
    </Layout>
  );
}

import { useState } from "react";
import { Lock, Loader2, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FileUpload } from "@/components/cipher/FileUpload";
import { Terminal, TerminalLine } from "@/components/cipher/Terminal";
import { CopyButton } from "@/components/cipher/CopyButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { encryptMessage, EncryptionResult } from "@/lib/cipher";
import { toast } from "sonner";

export default function Encrypt() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [result, setResult] = useState<EncryptionResult | null>(null);

  const handleEncrypt = async () => {
    if (!file) {
      toast.error("Please upload a BMP image");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter a password");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message to encrypt");
      return;
    }

    setIsEncrypting(true);
    setResult(null);

    try {
      const encryptionResult = await encryptMessage(file, password, message);
      setResult(encryptionResult);
      toast.success("Message encrypted successfully!");
    } catch (error) {
      toast.error("Encryption failed. Please try again.");
      console.error(error);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-4">
            <Lock className="h-4 w-4" />
            <span>Encryption Mode</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-glow">Encrypt</span> Your Message
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Upload a BMP image, enter your password and message. 
            Only someone with the same image and password can decrypt.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Input Card */}
          <Card glow className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Encryption Input
              </CardTitle>
              <CardDescription>
                All processing happens locally in your browser
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <FileUpload onFileSelect={setFile} />

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  Password / Secret Key
                </label>
                <Input
                  type="password"
                  placeholder="Enter your secret password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/20"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  Message to Encrypt
                </label>
                <Textarea
                  placeholder="Enter your secret message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="bg-input/50 border-border/50 focus:border-primary focus:ring-primary/20 resize-none"
                />
              </div>

              {/* Encrypt Button */}
              <Button
                variant="neon-solid"
                size="lg"
                className="w-full"
                onClick={handleEncrypt}
                disabled={isEncrypting || !file || !password || !message}
              >
                {isEncrypting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Encrypting...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Encrypt Message
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          {result && (
            <Card glow className="bg-card/50 backdrop-blur-sm border-accent/30 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Lock className="h-5 w-5" />
                  Encryption Complete
                </CardTitle>
                <CardDescription>
                  Share this ciphertext with the recipient
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Terminal */}
                <Terminal title="encryption-stats">
                  <div className="space-y-1">
                    <TerminalLine prefix="📸" variant="info">
                      BMP loaded: {result.stats.bmpSize.toLocaleString()} bytes
                    </TerminalLine>
                    <TerminalLine prefix="🔑" variant="info">
                      Fingerprint: {result.stats.fingerprintPreview}
                    </TerminalLine>
                    <TerminalLine prefix="🧂" variant="info">
                      Salt: {result.stats.saltPreview}
                    </TerminalLine>
                    <TerminalLine prefix="🔢" variant="info">
                      Nonce: {result.stats.noncePreview}
                    </TerminalLine>
                    <TerminalLine prefix="✅" variant="success">
                      Output: {result.stats.ciphertextSize} bytes
                    </TerminalLine>
                  </div>
                </Terminal>

                {/* Ciphertext Output */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">
                      Ciphertext (Base64)
                    </label>
                    <CopyButton text={result.ciphertext} />
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50 font-mono text-sm break-all max-h-40 overflow-y-auto">
                    {result.ciphertext}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

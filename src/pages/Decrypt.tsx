import { useState } from "react";
import { Unlock, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FileUpload } from "@/components/cipher/FileUpload";
import { Terminal, TerminalLine } from "@/components/cipher/Terminal";
import { CopyButton } from "@/components/cipher/CopyButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { decryptMessage, DecryptionResult } from "@/lib/cipher";
import { toast } from "sonner";

export default function Decrypt() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [result, setResult] = useState<DecryptionResult | null>(null);

  const handleDecrypt = async () => {
    if (!file) {
      toast.error("Please upload a BMP image");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter a password");
      return;
    }
    if (!ciphertext.trim()) {
      toast.error("Please paste the ciphertext");
      return;
    }

    setIsDecrypting(true);
    setResult(null);

    try {
      const decryptionResult = await decryptMessage(file, password, ciphertext.trim());
      setResult(decryptionResult);
      
      if (decryptionResult.success) {
        toast.success("Message decrypted successfully!");
      } else {
        toast.error("Decryption failed");
      }
    } catch (error) {
      toast.error("Decryption failed. Please check your inputs.");
      console.error(error);
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 text-sm text-accent mb-4">
            <Unlock className="h-4 w-4" />
            <span>Decryption Mode</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-glow-green text-accent">Decrypt</span> Your Message
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Use the same BMP image and password that was used to encrypt. 
            Any difference will result in decryption failure.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Input Card */}
          <Card glow className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5 text-accent" />
                Decryption Input
              </CardTitle>
              <CardDescription>
                Provide the exact same BMP and password used for encryption
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
                  className="bg-input/50 border-border/50 focus:border-accent focus:ring-accent/20"
                />
              </div>

              {/* Ciphertext */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  Ciphertext (Base64)
                </label>
                <Textarea
                  placeholder="Paste the encrypted ciphertext here..."
                  value={ciphertext}
                  onChange={(e) => setCiphertext(e.target.value)}
                  rows={4}
                  className="bg-input/50 border-border/50 focus:border-accent focus:ring-accent/20 resize-none font-mono text-sm"
                />
              </div>

              {/* Decrypt Button */}
              <Button
                variant="neon-green-solid"
                size="lg"
                className="w-full"
                onClick={handleDecrypt}
                disabled={isDecrypting || !file || !password || !ciphertext}
              >
                {isDecrypting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Decrypting...
                  </>
                ) : (
                  <>
                    <Unlock className="h-5 w-5" />
                    Decrypt Message
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result - Success */}
          {result?.success && (
            <Card glow className="bg-card/50 backdrop-blur-sm border-accent/30 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <CheckCircle2 className="h-5 w-5" />
                  Decryption Successful
                </CardTitle>
                <CardDescription>
                  The message has been recovered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Terminal */}
                {result.stats && (
                  <Terminal title="decryption-stats">
                    <div className="space-y-1">
                      <TerminalLine prefix="📸" variant="info">
                        BMP loaded: {result.stats.bmpSize.toLocaleString()} bytes
                      </TerminalLine>
                      <TerminalLine prefix="🔑" variant="info">
                        Fingerprint: {result.stats.fingerprintPreview}
                      </TerminalLine>
                      <TerminalLine prefix="✅" variant="success">
                        Decryption successful!
                      </TerminalLine>
                    </div>
                  </Terminal>
                )}

                {/* Decrypted Message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-muted-foreground">
                      Original Message
                    </label>
                    <CopyButton text={result.message || ""} />
                  </div>
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 text-foreground">
                    {result.message}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result - Error */}
          {result && !result.success && (
            <Card className="bg-card/50 backdrop-blur-sm border-destructive/30 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Decryption Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Terminal title="error-log">
                  <TerminalLine prefix="❌" variant="error">
                    {result.error}
                  </TerminalLine>
                  <div className="mt-4 text-muted-foreground text-sm">
                    <p>Possible causes:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Wrong BMP image file</li>
                      <li>Incorrect password</li>
                      <li>Corrupted or modified ciphertext</li>
                      <li>Ciphertext from a different encryption</li>
                    </ul>
                  </div>
                </Terminal>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

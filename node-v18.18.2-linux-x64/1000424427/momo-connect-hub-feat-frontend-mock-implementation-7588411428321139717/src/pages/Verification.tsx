import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scan, Search, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Verification = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<"valid" | "invalid" | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = () => {
    if (!code) return;
    setLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      const isValid = Math.random() > 0.3; // Random result for demo
      setResult(isValid ? "valid" : "invalid");
      
      if (isValid) {
        toast({ title: "Ticket Valide", className: "bg-green-500 text-white" });
      } else {
        toast({ variant: "destructive", title: "Ticket Invalide" });
      }
    }, 1000);
  };

  return (
    <div className="container max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Scan className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Vérification de Ticket</h1>
        <p className="text-muted-foreground">
          Entrez le code unique du ticket physique pour vérifier son authenticité.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scanner ou Saisir</CardTitle>
          <CardDescription>Code à 8 caractères alphanumériques</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Ex: A1B2-C3D4" 
              className="text-center uppercase tracking-widest font-mono text-lg"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={9}
            />
          </div>
          <Button className="w-full" onClick={handleVerify} disabled={loading || code.length < 4}>
            {loading ? "Vérification..." : "Vérifier le Code"} <Search className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {result === "valid" && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="p-6 text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className="text-xl font-bold text-green-800">Ticket Authentique</h3>
            <p className="text-green-700">Ce ticket a été émis par un créateur certifié MoMo Hub.</p>
            <div className="pt-2 text-sm">
              <p>ID: {code}</p>
              <p>Créateur: ProBet 242</p>
              <p>Date: 20/05/2025</p>
            </div>
          </CardContent>
        </Card>
      )}

      {result === "invalid" && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-6 text-center space-y-2">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <h3 className="text-xl font-bold text-destructive">Ticket Invalide</h3>
            <p className="text-destructive/80">Ce code ne correspond à aucun ticket enregistré dans notre système.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
export default Verification;
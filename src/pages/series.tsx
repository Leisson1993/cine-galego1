import { useState } from "react";
import { Header } from "@/components/header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Series = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Em breve!</strong>
            <br />
            A seção de séries estará disponível em breve.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
};

export default Series;
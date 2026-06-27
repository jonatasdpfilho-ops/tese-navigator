import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang="pt" />
      <main className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-7xl font-bold text-primary/20">404</h1>
          <h2 className="text-2xl font-bold text-primary">Página não encontrada</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/">Voltar ao Início</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

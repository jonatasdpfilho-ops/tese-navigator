import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { blogPosts } from "@/data/blogPosts";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const post = blogPosts.find((p) => p.slug === slug);
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copiado!", description: "O link foi copiado para a área de transferência." });
  };

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header lang="pt" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-primary">Artigo não encontrado</h1>
            <Button asChild variant="outline">
              <Link to="/blog"><ArrowLeft className="h-4 w-4 mr-2" />Voltar ao Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const lines = post.content.split("\n");

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang="pt" />
      <main className="flex-1">
        <section className="bg-gradient-hero text-white py-16">
          <div className="container max-w-3xl space-y-4">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Blog
            </Link>
            <Badge variant="secondary" className="text-xs">{post.category}</Badge>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                {post.category}
              </span>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container max-w-3xl space-y-8">
            <article className="prose prose-slate max-w-none space-y-4">
              {lines.map((line, i) => {
                if (line.startsWith("## ")) {
                  return <h2 key={i} className="text-xl font-bold text-primary mt-8 mb-3">{line.replace("## ", "")}</h2>;
                }
                if (line.startsWith("### ")) {
                  return <h3 key={i} className="text-lg font-semibold text-primary mt-6 mb-2">{line.replace("### ", "")}</h3>;
                }
                if (line.startsWith("- ")) {
                  return <li key={i} className="text-muted-foreground ml-4 list-disc">{line.replace("- ", "")}</li>;
                }
                if (line.trim() === "") {
                  return <div key={i} className="h-2" />;
                }
                return (
                  <p key={i} className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                  />
                );
              })}
            </article>

            <div className="border-t border-border pt-6 space-y-3">
              <p className="text-sm font-medium text-primary flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                >
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={copyLink}>
                  <Copy className="h-3 w-3 mr-1.5" />
                  Copiar link
                </Button>
              </div>
            </div>

            {related.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-primary">Artigos Relacionados</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      to={`/blog/${r.slug}`}
                      className="group p-4 border border-border rounded-lg hover:border-accent/40 hover:shadow-card transition-all duration-200 space-y-2"
                    >
                      <Badge variant="secondary" className="text-xs">{r.category}</Badge>
                      <h3 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
                        {r.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{r.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

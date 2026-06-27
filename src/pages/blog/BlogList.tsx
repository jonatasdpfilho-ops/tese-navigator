import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { blogPosts } from "@/data/blogPosts";

const ALL = "Todos";

export default function BlogList() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL);

  const categories = [ALL, ...Array.from(new Set(blogPosts.map((p) => p.category)))];

  const filtered = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === ALL || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang="pt" />
      <main className="flex-1">
        <section className="bg-gradient-hero text-white py-16">
          <div className="container space-y-3">
            <h1 className="text-3xl md:text-5xl font-bold">Novidades Jurídicas</h1>
            <p className="text-white/70 text-lg max-w-xl">
              Informações atualizadas sobre direitos previdenciários e bancários.
            </p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar artigos..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      activeCategory === cat
                        ? "bg-primary text-white border-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                Nenhum artigo encontrado com os filtros aplicados.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group block bg-card border border-border rounded-lg overflow-hidden shadow-card hover:shadow-card-hover hover:border-accent/40 transition-all duration-200"
                  >
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Tag className="h-3 w-3 text-accent" />
                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      </div>
                      <h2 className="font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </Link>
                ))}
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

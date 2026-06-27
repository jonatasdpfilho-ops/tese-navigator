import { useState } from "react";
import { LogOut, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { blogPosts, BlogPost } from "@/data/blogPosts";

const ADMIN_KEY = "admin2025";

export default function Admin() {
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem("admin_key") === ADMIN_KEY
  );
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>({});

  const login = () => {
    if (password === ADMIN_KEY) {
      localStorage.setItem("admin_key", ADMIN_KEY);
      setAuthenticated(true);
    } else {
      toast({ title: "Senha incorreta", variant: "destructive" });
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_key");
    setAuthenticated(false);
  };

  const startNew = () => {
    setEditing({ slug: "", title: "", excerpt: "", content: "", author: "", date: "", category: "" });
    setForm({});
  };

  const startEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({ ...post });
  };

  const deletePost = (slug: string) => {
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
    toast({ title: "Artigo removido." });
  };

  const savePost = () => {
    if (!form.title || !form.slug) {
      toast({ title: "Título e slug são obrigatórios.", variant: "destructive" });
      return;
    }
    const isNew = !posts.find((p) => p.slug === form.slug);
    if (isNew) {
      setPosts((prev) => [...prev, form as BlogPost]);
    } else {
      setPosts((prev) => prev.map((p) => (p.slug === form.slug ? ({ ...p, ...form } as BlogPost) : p)));
    }
    setEditing(null);
    toast({ title: isNew ? "Artigo criado!" : "Artigo atualizado!" });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-6 p-8 bg-card border border-border rounded-xl shadow-card">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-primary">Área Administrativa</h1>
            <p className="text-sm text-muted-foreground">JP&F Advogados</p>
          </div>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
            <Button className="w-full bg-primary hover:bg-primary/90" onClick={login}>
              Entrar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-primary">JP&F Advogados</h1>
          <p className="text-xs text-muted-foreground">Painel Administrativo</p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-1.5" />
          Sair
        </Button>
      </header>

      <main className="container py-8 space-y-6">
        <Tabs defaultValue="artigos">
          <TabsList>
            <TabsTrigger value="artigos">Artigos</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="artigos" className="space-y-6 mt-6">
            {editing ? (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-primary">
                    {posts.find((p) => p.slug === form.slug) ? "Editar Artigo" : "Novo Artigo"}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancelar</Button>
                </div>
                <div className="space-y-3 bg-card border border-border rounded-lg p-5">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Título</label>
                      <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título do artigo" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Slug</label>
                      <Input value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="url-do-artigo" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Categoria</label>
                      <Input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ex: Direito Previdenciário" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">Autor</label>
                      <Input value={form.author || ""} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Nome do autor" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Data</label>
                    <Input type="date" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Resumo</label>
                    <Textarea rows={2} value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Breve descrição do artigo" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">Conteúdo (Markdown)</label>
                    <Textarea rows={10} value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Conteúdo completo do artigo em Markdown..." />
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={savePost}>
                    Salvar Artigo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-primary">Artigos ({posts.length})</h2>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" size="sm" onClick={startNew}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    Novo Artigo
                  </Button>
                </div>
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="w-24">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post.slug}>
                          <TableCell className="font-medium text-sm max-w-xs truncate">{post.title}</TableCell>
                          <TableCell><Badge variant="secondary" className="text-xs">{post.category}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(post.date).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(post)}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deletePost(post.slug)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="configuracoes" className="mt-6">
            <div className="max-w-lg space-y-4">
              <h2 className="text-lg font-semibold text-primary">Configurações</h2>
              <div className="bg-card border border-border rounded-lg p-5 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sistema de gerenciamento de conteúdo. Em produção, conectar ao Supabase.
                </p>
                <div className="space-y-1">
                  <label className="text-sm font-medium">E-mail de contato</label>
                  <Input defaultValue="contato@jonatasdepaulafilho.adv.br" readOnly className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">WhatsApp</label>
                  <Input defaultValue="5561999990000" readOnly className="bg-muted" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

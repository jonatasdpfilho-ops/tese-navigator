import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import {
  Shield,
  Users,
  Star,
  CheckCircle,
  Phone,
  FileText,
  Search,
  Handshake,
  ArrowRight,
  Scale,
  Heart,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const contactSchema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone obrigatório"),
  area: z.string().min(1, "Selecione uma área"),
  mensagem: z.string().min(10, "Mensagem muito curta"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Home() {
  const { toast } = useToast();
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nome: "", email: "", telefone: "", area: "", mensagem: "" },
  });

  const onSubmit = (_data: ContactForm) => {
    toast({
      title: "Mensagem enviada!",
      description: "Retornaremos em até 24 horas úteis.",
    });
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang="pt" />
      <main className="flex-1">
        <section id="inicio" className="bg-gradient-hero text-white py-24 md:py-36">
          <div className="container text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Jonatas de Paula <span className="text-accent">&</span> Filho Advogados
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 leading-relaxed">
              Assessoria jurídica especializada com excelência técnica e dedicação ao cliente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <a href="#contato">Fale Conosco</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <a href="#sobre">Conheça o Escritório</a>
              </Button>
            </div>
          </div>
          <div className="mt-16 border-t border-accent/30" />
        </section>

        <section id="sobre" className="py-20 bg-background">
          <div className="container space-y-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Sobre o Escritório</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                O escritório Jonatas de Paula & Filho Advogados atua com foco na defesa dos direitos dos cidadãos, especialmente aposentados, pensionistas e servidores públicos. Nossa atuação é pautada pela seriedade, transparência e compromisso com a busca do melhor resultado para cada cliente, dentro dos limites éticos da profissão.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Heart className="h-7 w-7 text-accent" />,
                  title: "Missão",
                  text: "Prestar serviços jurídicos de excelência com foco na proteção dos direitos de nossos clientes, oferecendo assessoria técnica, ética e personalizada.",
                },
                {
                  icon: <Star className="h-7 w-7 text-accent" />,
                  title: "Visão",
                  text: "Ser reconhecido como um escritório de referência nas áreas de direito previdenciário e bancário, construindo relações duradouras com nossos clientes.",
                },
                {
                  icon: <Scale className="h-7 w-7 text-accent" />,
                  title: "Valores",
                  text: "Ética, Comprometimento, Excelência Técnica, Transparência, Responsabilidade Social.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-card border border-border rounded-lg p-6 space-y-3 shadow-card hover:shadow-card-hover transition-all duration-200"
                >
                  {card.icon}
                  <h3 className="text-lg font-semibold text-primary">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="areas" className="py-20 bg-secondary">
          <div className="container space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Áreas de Atuação</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Atuamos de forma especializada nas seguintes áreas do direito.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <FileText className="h-8 w-8" />,
                  title: "Isenção de Imposto de Renda",
                  desc: "Aposentados e pensionistas portadores de doenças graves têm direito à isenção do IR sobre seus proventos, conforme a Lei nº 7.713/88.",
                  href: "/servicos/isencao-ir-doenca-grave",
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "Conversão de RMC",
                  desc: "Análise e conversão da Reserva de Margem Consignável em empréstimo consignado em condições potencialmente mais favoráveis.",
                  href: "/servicos/conversao-rmc-consignado",
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "Conversão de RCC",
                  desc: "Análise e conversão da Reserva de Crédito Consignável visando condições mais adequadas para o beneficiário.",
                  href: "/servicos/conversao-rcc-consignado",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="group bg-card border border-border rounded-lg p-6 space-y-4 shadow-card hover:shadow-card-hover hover:border-accent/50 transition-all duration-200"
                >
                  <div className="text-primary group-hover:text-accent transition-colors">{card.icon}</div>
                  <h3 className="text-lg font-semibold text-primary">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                  <Link
                    to={card.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    Saiba mais <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="diferenciais" className="py-20 bg-background">
          <div className="container space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Por que nos escolher?</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Users className="h-8 w-8 text-accent" />, title: "Atendimento Personalizado", desc: "Cada caso é tratado de forma individual, com atenção às necessidades específicas do cliente." },
                { icon: <Award className="h-8 w-8 text-accent" />, title: "Equipe Especializada", desc: "Profissionais com formação técnica sólida nas áreas de direito previdenciário e bancário." },
                { icon: <Scale className="h-8 w-8 text-accent" />, title: "Ética e Transparência", desc: "Atuação pautada pelo Código de Ética da OAB, com clareza em todas as etapas do processo." },
                { icon: <Handshake className="h-8 w-8 text-accent" />, title: "Compromisso com o Cliente", desc: "Dedicação integral à defesa dos interesses do cliente, com comunicação clara e direta." },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-start gap-3 p-5 rounded-lg bg-card border border-border">
                  {item.icon}
                  <h3 className="font-semibold text-primary">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="py-20 bg-primary text-white">
          <div className="container space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">Como funciona o atendimento</h2>
              <p className="text-white/70 max-w-xl mx-auto">
                Um processo claro e transparente para garantir o melhor resultado.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: "1", icon: <Phone className="h-6 w-6" />, title: "Contato Inicial", desc: "Entre em contato pelo WhatsApp ou formulário para expor sua situação." },
                { num: "2", icon: <Search className="h-6 w-6" />, title: "Análise do Caso", desc: "Nossa equipe realiza análise preliminar da viabilidade jurídica sem custo." },
                { num: "3", icon: <FileText className="h-6 w-6" />, title: "Apresentação da Estratégia", desc: "Apresentamos a estratégia jurídica recomendada com clareza sobre prazos e etapas." },
                { num: "4", icon: <CheckCircle className="h-6 w-6" />, title: "Acompanhamento", desc: "Acompanhamento integral do processo com atualizações regulares ao cliente." },
              ].map((step) => (
                <div key={step.num} className="flex flex-col gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold text-lg">
                    {step.num}
                  </div>
                  <div className="flex items-center gap-2 text-white/80">{step.icon}<h3 className="font-semibold text-white">{step.title}</h3></div>
                  <p className="text-sm text-white/60 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-background">
          <div className="container max-w-3xl space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Perguntas Frequentes</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {[
                { q: "O escritório atende em todo o Brasil?", a: "Sim, realizamos atendimento remoto para todo o território nacional." },
                { q: "Como faço para agendar uma consulta?", a: "Entre em contato pelo WhatsApp ou pelo formulário deste site. Retornaremos em até 24 horas úteis." },
                { q: "Quanto tempo demora um processo de isenção de IR?", a: "O prazo varia conforme o caso. Após a análise documental, informamos uma estimativa realista ao cliente." },
                { q: "Vocês cobram consulta inicial?", a: "Realizamos uma análise preliminar sem custo para verificar se há base jurídica para o seu caso." },
                { q: "Como funciona a conversão de RMC/RCC?", a: "Realizamos uma análise do contrato e do histórico de crédito do cliente para identificar a viabilidade da conversão." },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-medium text-primary hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section id="contato" className="py-20 bg-secondary">
          <div className="container max-w-2xl space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Entre em Contato</h2>
              <p className="text-muted-foreground">Preencha o formulário e nossa equipe retornará em até 24 horas úteis.</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 bg-card border border-border rounded-lg p-6 shadow-card">
                <FormField control={form.control} name="nome" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl><Input placeholder="Seu nome completo" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="telefone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (WhatsApp)</FormLabel>
                      <FormControl><Input placeholder="(61) 99999-0000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="area" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área de Interesse</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecione uma área" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="isencao-ir">Isenção de IR</SelectItem>
                        <SelectItem value="conversao-rmc">Conversão de RMC</SelectItem>
                        <SelectItem value="conversao-rcc">Conversão de RCC</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="mensagem" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem</FormLabel>
                    <FormControl><Textarea rows={4} placeholder="Descreva brevemente seu caso..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Enviar Mensagem
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Este formulário é utilizado exclusivamente para fins de contato inicial.
                </p>
              </form>
            </Form>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

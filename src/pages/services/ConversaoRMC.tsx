import { Link } from "react-router-dom";
import { ChevronRight, FileText, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const steps = [
  { title: "Análise do Contrato", desc: "Verificamos as condições do contrato de RMC vigente, incluindo taxas e saldo devedor." },
  { title: "Verificação da Margem", desc: "Analisamos a margem consignável disponível e os limites legais aplicáveis." },
  { title: "Comparação de Condições", desc: "Comparamos as condições da RMC com as do empréstimo consignado para verificar a viabilidade da conversão." },
  { title: "Negociação e Formalização", desc: "Acompanhamos a negociação com a instituição financeira e a formalização do novo contrato." },
];

const documents = [
  "Documento de identidade (RG ou CNH)",
  "CPF",
  "Extrato do benefício previdenciário",
  "Contrato de RMC vigente",
  "Extratos do cartão consignado (últimos 6 meses)",
  "Comprovante de endereço",
];

const faqs = [
  {
    q: "O que é a RMC?",
    a: "A Reserva de Margem Consignável (RMC) é um percentual da margem consignável do beneficiário reservado para operações de cartão de crédito consignado. Corresponde a até 5% dos proventos.",
  },
  {
    q: "Quem pode converter a RMC?",
    a: "Aposentados e pensionistas do INSS que possuem RMC ativa e têm margem consignável disponível para operações de crédito.",
  },
  {
    q: "A conversão é sempre vantajosa?",
    a: "Não necessariamente. Cada caso deve ser analisado individualmente. A conversão pode ser vantajosa quando as condições do empréstimo consignado são melhores do que as do cartão consignado.",
  },
  {
    q: "Existe algum risco na conversão?",
    a: "A conversão em si não gera risco adicional, desde que seja realizada dentro dos limites legais de margem. É importante analisar todos os termos antes de assinar qualquer contrato.",
  },
  {
    q: "Quanto tempo leva o processo?",
    a: "O prazo varia conforme a instituição financeira e as particularidades do caso. Após a análise, informamos uma estimativa ao cliente.",
  },
];

export default function ConversaoRMC() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header lang="pt" />
      <main className="flex-1">
        <section className="bg-gradient-hero text-white py-16">
          <div className="container space-y-4">
            <nav className="flex items-center gap-1 text-sm text-white/60">
              <Link to="/" className="hover:text-white transition-colors">Início</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="hover:text-white cursor-default">Áreas de Atuação</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">Conversão de RMC</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
              Conversão de RMC em Empréstimo Consignado
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              Análise especializada da Reserva de Margem Consignável para identificar condições mais favoráveis ao beneficiário.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container max-w-4xl space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">O que é a RMC?</h2>
              <p className="text-muted-foreground leading-relaxed">
                A <strong>Reserva de Margem Consignável (RMC)</strong> é um mecanismo criado pelo Decreto nº 10.820/2021, que permite que aposentados e pensionistas do INSS utilizem até 5% de seus proventos para pagamento de cartão de crédito consignado. Embora seja uma modalidade de crédito acessível, em alguns casos as condições podem ser aprimoradas por meio da conversão para empréstimo consignado tradicional.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Quem Pode Se Beneficiar</h2>
              <ul className="space-y-2">
                {[
                  "Aposentados do INSS com RMC ativa",
                  "Pensionistas do INSS com RMC ativa",
                  "Beneficiários que desejam renegociar condições de crédito",
                  "Titulares com saldo devedor no cartão consignado",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Como Funciona</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {steps.map((step, i) => (
                  <div key={step.title} className="flex gap-4 p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent text-accent-foreground font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-sm">{step.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Documentos Necessários</h2>
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Perguntas Frequentes</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium text-primary hover:no-underline text-sm">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="rounded-lg bg-primary text-white p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold">Solicite uma Análise Gratuita</h2>
              <p className="text-white/70">
                Entre em contato para verificar se a conversão é vantajosa no seu caso.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  <a href="https://wa.me/5561999990000" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Falar pelo WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/#contato">Formulário de Contato</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

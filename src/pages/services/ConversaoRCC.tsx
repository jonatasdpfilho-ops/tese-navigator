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
  { title: "Análise do Contrato de RCC", desc: "Examinamos o contrato de RCC vigente, taxas aplicadas e saldo devedor existente." },
  { title: "Avaliação da Margem", desc: "Verificamos a margem consignável total disponível e os percentuais já comprometidos." },
  { title: "Estudo de Viabilidade", desc: "Elaboramos comparativo entre as condições da RCC e do empréstimo consignado disponível." },
  { title: "Acompanhamento da Conversão", desc: "Orientamos e acompanhamos todas as etapas da negociação e formalização com a instituição financeira." },
];

const documents = [
  "Documento de identidade (RG ou CNH)",
  "CPF",
  "Extrato do benefício previdenciário",
  "Contrato de RCC vigente",
  "Extratos de utilização do benefício de cartão (últimos 6 meses)",
  "Comprovante de endereço",
  "Histórico de crédito (quando disponível)",
];

const faqs = [
  {
    q: "O que é a RCC?",
    a: "A Reserva de Crédito Consignável (RCC) é um percentual da margem consignável destinado a operações de cartão de benefício (crédito consignado na modalidade cartão), correspondendo a até 5% dos proventos do beneficiário.",
  },
  {
    q: "Qual a diferença entre RMC e RCC?",
    a: "Ambas reservam 5% da margem para cartão consignado. A RMC é destinada ao cartão de crédito consignado, enquanto a RCC é destinada ao cartão de benefício. As duas modalidades foram instituídas para ampliar o acesso ao crédito para aposentados e pensionistas.",
  },
  {
    q: "A conversão elimina a dívida do cartão?",
    a: "Não. A conversão transforma o saldo devedor em um empréstimo consignado, consolidando a dívida com condições potencialmente diferentes. O montante devido permanece, mas pode ser refinanciado.",
  },
  {
    q: "Posso converter a RCC se já tenho outros empréstimos consignados?",
    a: "Depende da margem disponível. O comprometimento total com consignações não pode ultrapassar os limites legais. Nossa equipe analisa cada caso individualmente.",
  },
  {
    q: "O atendimento é presencial?",
    a: "Não é necessário. Todo o atendimento pode ser realizado de forma remota, com envio de documentos por meios digitais.",
  },
];

export default function ConversaoRCC() {
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
              <span className="text-white">Conversão de RCC</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
              Conversão de RCC em Empréstimo Consignado
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              Análise técnica da Reserva de Crédito Consignável para identificar alternativas mais adequadas ao beneficiário.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container max-w-4xl space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">O que é a RCC?</h2>
              <p className="text-muted-foreground leading-relaxed">
                A <strong>Reserva de Crédito Consignável (RCC)</strong> é uma modalidade de crédito que reserva até 5% da margem consignável de aposentados e pensionistas do INSS para uso em cartão de benefício. Assim como a RMC, foi criada para ampliar o acesso a crédito, mas pode em determinadas situações ser substituída por modalidade com condições mais adequadas para o titular.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Quem Pode Se Beneficiar</h2>
              <ul className="space-y-2">
                {[
                  "Aposentados do INSS com RCC ativa",
                  "Pensionistas do INSS com RCC ativa",
                  "Beneficiários que utilizam cartão de benefício consignado",
                  "Titulares que desejam renegociar as condições do crédito",
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
              <h2 className="text-2xl font-bold">Fale com Nossa Equipe</h2>
              <p className="text-white/70">
                Realizamos análise sem custo para verificar as opções disponíveis no seu caso.
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

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

const diseases = [
  "Moléstia profissional",
  "Tuberculose ativa",
  "Alienação mental",
  "Esclerose múltipla",
  "Neoplasia maligna (câncer)",
  "Cegueira",
  "Hanseníase",
  "Paralisia irreversível e incapacitante",
  "Cardiopatia grave",
  "Doença de Parkinson",
  "Espondiloartrose anquilosante",
  "Nefropatia grave",
  "Hepatopatia grave",
  "Estados avançados da doença de Paget",
];

const documents = [
  "Documento de identidade (RG ou CNH)",
  "CPF",
  "Comprovante de recebimento de benefício previdenciário (extrato do INSS)",
  "Laudo médico atualizado emitido por médico especialista",
  "Declaração de Imposto de Renda dos últimos 5 anos (se houver)",
  "Extrato de pagamento de IR retido na fonte (informe de rendimentos)",
  "Histórico de tratamento médico relacionado à doença",
  "Documentação complementar conforme o caso",
];

const steps = [
  { title: "Análise Documental", desc: "Verificamos os documentos médicos e financeiros para confirmar a elegibilidade." },
  { title: "Elaboração do Requerimento", desc: "Preparamos o pedido administrativo ou judicial, conforme necessário." },
  { title: "Protocolo e Acompanhamento", desc: "Protocolamos o pedido perante os órgãos competentes e acompanhamos o andamento." },
  { title: "Restituição de Valores", desc: "Quando aplicável, buscamos a restituição dos valores pagos nos últimos 5 anos." },
];

const faqs = [
  {
    q: "Quando posso requerer a isenção?",
    a: "A partir do diagnóstico da doença prevista em lei, independentemente da data de início da aposentadoria.",
  },
  {
    q: "A isenção se aplica a toda a renda do aposentado?",
    a: "Não. A isenção incide exclusivamente sobre os proventos de aposentadoria, pensão ou reforma. Outras rendas permanecem tributáveis.",
  },
  {
    q: "É possível recuperar o IR pago antes do reconhecimento da isenção?",
    a: "Sim. É possível requerer a restituição dos valores pagos indevidamente nos últimos 5 anos, contados da data do pedido.",
  },
  {
    q: "Preciso de laudo médico de médico oficial?",
    a: "Depende do caminho escolhido. Na via administrativa perante a Receita Federal, geralmente exige-se laudo de médico integrante de serviço médico oficial. Na via judicial, o laudo de médico particular pode ser suficiente para embasar o pedido.",
  },
  {
    q: "O processo é todo feito de forma remota?",
    a: "Sim. Realizamos o atendimento de forma remota para todo o território nacional. Os documentos podem ser enviados digitalmente.",
  },
];

export default function IsencaoIR() {
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
              <span className="text-white">Isenção de IR</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
              Isenção de Imposto de Renda para Portadores de Doenças Graves
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              Aposentados e pensionistas com doenças graves têm direito garantido por lei à isenção do IR sobre seus proventos.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container max-w-4xl space-y-10">
            <div className="prose prose-slate max-w-none space-y-4">
              <h2 className="text-2xl font-bold text-primary">Fundamento Legal</h2>
              <p className="text-muted-foreground leading-relaxed">
                Aposentados e pensionistas portadores de doenças graves têm direito à isenção do Imposto de Renda sobre os proventos recebidos, conforme previsto no <strong>art. 6º, XIV, da Lei nº 7.713/88</strong>. O direito à isenção independe da data em que a doença foi contraída ou do momento em que foi iniciado o benefício previdenciário.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Doenças Contempladas pela Lei</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {diseases.map((d) => (
                  <div key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Quem Pode Se Beneficiar?</h2>
              <ul className="space-y-2 text-muted-foreground">
                {["Aposentados do INSS", "Pensionistas do INSS", "Beneficiários de auxílio por incapacidade", "Servidores públicos aposentados ou em pensão", "Militares da reserva remunerada"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Como Funciona o Processo</h2>
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
              <p className="text-xs text-muted-foreground">
                * A documentação exata pode variar conforme as particularidades de cada caso.
              </p>
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
              <h2 className="text-2xl font-bold">Verifique se você tem direito</h2>
              <p className="text-white/70">
                Realizamos análise preliminar sem custo. Entre em contato e nossa equipe avaliará seu caso.
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

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
  nome: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email"),
  telefone: z.string().min(10, "Phone is required"),
  area: z.string().min(1, "Please select an area"),
  mensagem: z.string().min(10, "Message is too short"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function HomeEn() {
  const { toast } = useToast();
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nome: "", email: "", telefone: "", area: "", mensagem: "" },
  });

  const onSubmit = (_data: ContactForm) => {
    toast({
      title: "Message sent!",
      description: "We will get back to you within 24 business hours.",
    });
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang="en" />
      <main className="flex-1">
        <section id="inicio" className="bg-gradient-hero text-white py-24 md:py-36">
          <div className="container text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Jonatas de Paula <span className="text-accent">&</span> Filho Advogados
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 leading-relaxed">
              Specialized legal advisory services with technical excellence and dedication to our clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <a href="#contato">Contact Us</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <a href="#sobre">About Our Firm</a>
              </Button>
            </div>
          </div>
          <div className="mt-16 border-t border-accent/30" />
        </section>

        <section id="sobre" className="py-20 bg-background">
          <div className="container space-y-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">About Our Firm</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Jonatas de Paula & Filho Law Firm focuses on defending citizens' rights, especially retirees, pensioners, and public servants. Our work is guided by seriousness, transparency, and commitment to achieving the best outcome for each client within the ethical standards of the profession.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Heart className="h-7 w-7 text-accent" />,
                  title: "Mission",
                  text: "To provide excellent legal services focused on protecting our clients' rights, offering technical, ethical, and personalized advisory.",
                },
                {
                  icon: <Star className="h-7 w-7 text-accent" />,
                  title: "Vision",
                  text: "To be recognized as a reference law firm in social security and banking law, building lasting relationships with our clients.",
                },
                {
                  icon: <Scale className="h-7 w-7 text-accent" />,
                  title: "Values",
                  text: "Ethics, Commitment, Technical Excellence, Transparency, Social Responsibility.",
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
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Practice Areas</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We practice in the following areas of law.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <FileText className="h-8 w-8" />,
                  title: "Income Tax Exemption",
                  desc: "Retirees and pensioners with serious illnesses are entitled to income tax exemption on their benefits, pursuant to Law No. 7,713/88.",
                  href: "/servicos/isencao-ir-doenca-grave",
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "RMC Conversion",
                  desc: "Analysis and conversion of the Consignable Margin Reserve (RMC) into a payroll loan under potentially more favorable conditions.",
                  href: "/servicos/conversao-rmc-consignado",
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "RCC Conversion",
                  desc: "Analysis and conversion of the Consignable Credit Reserve (RCC) to achieve more suitable conditions for the beneficiary.",
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
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="diferenciais" className="py-20 bg-background">
          <div className="container space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Why Choose Us?</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Users className="h-8 w-8 text-accent" />, title: "Personalized Service", desc: "Each case is treated individually, with attention to the client's specific needs." },
                { icon: <Award className="h-8 w-8 text-accent" />, title: "Specialized Team", desc: "Professionals with solid technical background in social security and banking law." },
                { icon: <Scale className="h-8 w-8 text-accent" />, title: "Ethics & Transparency", desc: "Practice guided by the Brazilian Bar Association's Code of Ethics." },
                { icon: <Handshake className="h-8 w-8 text-accent" />, title: "Client Commitment", desc: "Full dedication to the client's interests with clear and direct communication." },
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
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="text-white/70 max-w-xl mx-auto">
                A clear and transparent process to ensure the best outcome.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: "1", icon: <Phone className="h-6 w-6" />, title: "Initial Contact", desc: "Reach out via WhatsApp or the contact form to explain your situation." },
                { num: "2", icon: <Search className="h-6 w-6" />, title: "Case Analysis", desc: "Our team performs a preliminary legal viability analysis at no cost." },
                { num: "3", icon: <FileText className="h-6 w-6" />, title: "Strategy Presentation", desc: "We present the recommended legal strategy with clarity on timelines and steps." },
                { num: "4", icon: <CheckCircle className="h-6 w-6" />, title: "Follow-up", desc: "Full monitoring of the process with regular updates to the client." },
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
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {[
                { q: "Does the firm serve clients across Brazil?", a: "Yes, we provide remote service for clients across the entire national territory." },
                { q: "How do I schedule a consultation?", a: "Contact us via WhatsApp or the contact form on this website. We will respond within 24 business hours." },
                { q: "How long does an income tax exemption process take?", a: "The timeline varies depending on the case. After document review, we provide a realistic estimate to the client." },
                { q: "Do you charge for the initial consultation?", a: "We perform a preliminary analysis at no cost to verify whether there is a legal basis for your case." },
                { q: "How does the RMC/RCC conversion work?", a: "We analyze the contract and the client's credit history to identify the feasibility of the conversion." },
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
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Get in Touch</h2>
              <p className="text-muted-foreground">Fill in the form and our team will respond within 24 business hours.</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 bg-card border border-border rounded-lg p-6 shadow-card">
                <FormField control={form.control} name="nome" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="telefone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (WhatsApp)</FormLabel>
                      <FormControl><Input placeholder="+55 61 99999-0000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="area" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area of Interest</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select an area" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income-tax">Income Tax Exemption</SelectItem>
                        <SelectItem value="rmc">RMC Conversion</SelectItem>
                        <SelectItem value="rcc">RCC Conversion</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="mensagem" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl><Textarea rows={4} placeholder="Briefly describe your case..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Send Message
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  This form is used exclusively for initial contact purposes.
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

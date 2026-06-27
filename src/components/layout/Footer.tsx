import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary-deep text-white/80 pt-12 pb-6">
      <div className="container grid gap-10 md:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-white mb-2">
            JP<span className="text-accent">&</span>F Advogados
          </p>
          <p className="text-sm leading-relaxed text-white/60">
            Assessoria jurídica especializada com excelência técnica e dedicação ao cliente.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Links</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/#inicio" className="hover:text-accent transition-colors">Início</a></li>
            <li><a href="/#areas" className="hover:text-accent transition-colors">Áreas de Atuação</a></li>
            <li><Link to="/blog" className="hover:text-accent transition-colors">Novidades</Link></li>
            <li><Link to="/servicos/isencao-ir-doenca-grave" className="hover:text-accent transition-colors">Isenção de IR</Link></li>
            <li><Link to="/servicos/conversao-rmc-consignado" className="hover:text-accent transition-colors">Conversão de RMC</Link></li>
            <li><Link to="/servicos/conversao-rcc-consignado" className="hover:text-accent transition-colors">Conversão de RCC</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Contato</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent shrink-0" />
              <a href="mailto:contato@jonatasdepaulafilho.adv.br" className="hover:text-accent transition-colors break-all">
                contato@jonatasdepaulafilho.adv.br
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-accent shrink-0" />
              <a href="https://wa.me/5561999990000" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                (61) 99999-0000
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-10 border-t border-white/10 pt-6 space-y-3">
        <p className="text-xs text-white/50 leading-relaxed">
          Este site tem caráter exclusivamente informativo e institucional. As informações aqui contidas não constituem aconselhamento jurídico.
        </p>
        <p className="text-xs text-white/40">
          © 2025 Jonatas de Paula & Filho Advogados. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

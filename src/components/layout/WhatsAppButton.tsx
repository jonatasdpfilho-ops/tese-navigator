import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5561999990000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-200 px-4 py-3"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-medium whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300">
        Fale conosco
      </span>
    </a>
  );
}

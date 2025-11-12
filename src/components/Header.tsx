import reaLogo from "@/assets/rea-logo.jpg";
import animaLogo from "@/assets/anima-logo.jpeg";

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-brand-teal to-brand-blue shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <img 
              src={reaLogo} 
              alt="REA Advertising Logo" 
              className="h-12 md:h-16 w-auto object-contain bg-white rounded-lg px-3 py-2"
            />
            <div className="hidden md:block h-12 w-px bg-white/30"></div>
            <img 
              src={animaLogo} 
              alt="ANIMA Tech Studio Logo" 
              className="h-12 md:h-16 w-auto object-contain rounded-lg"
            />
          </div>
          <div className="text-right">
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">
              REA QUOTATION TRACKER
            </h1>
            <p className="text-xs md:text-sm text-white/90 mt-1">
              Powered by ANIMA Tech Studio
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

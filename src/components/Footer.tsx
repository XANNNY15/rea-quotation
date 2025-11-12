export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} REA Advertising. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Developed by</span>
            <span className="text-sm font-semibold text-brand-gold">ANIMA Tech Studio</span>
            <span className="text-xs text-muted-foreground">• Technology with a Soul</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

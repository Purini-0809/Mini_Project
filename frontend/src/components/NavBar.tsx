import { Link, useLocation } from "react-router-dom";

const LinkItem = ({ to, label }: { to: string; label: string }) => {
  const { pathname, hash } = useLocation();
  const currentHash = hash?.replace('#', '');
  const currentPath = currentHash || pathname;
  const current = currentPath === to || (to === '/' && (hash === '' || hash === '#/'));
  return (
    <Link to={to} className={`px-3 py-2 rounded-md text-sm font-medium ${current ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>
      {label}
    </Link>
  );
};

export const NavBar = () => {
  return (
    <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold">Smart Home Valuation</Link>
        <nav className="flex items-center gap-2">
          <LinkItem to="/auth" label="Login" />
          <LinkItem to="/" label="Home" />
          <LinkItem to="/compare" label="Compare" />
          <LinkItem to="/emi" label="EMI" />
        </nav>
      </div>
    </div>
  );
};

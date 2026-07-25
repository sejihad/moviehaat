import { Film, LayoutDashboard, LogOut, Search, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../actions/userAction";

const navigation = [
  { label: "Home", path: "/" },
  { label: "Movies", path: "/movies" },
  { label: "Blog", path: "/blogs" },
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    setAccountMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) setAccountMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeMenu);
    return () => document.removeEventListener("pointerdown", closeMenu);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/movies?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080a0f]/95 backdrop-blur-xl">
      <div className="container grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-3 lg:gap-x-8">
        <div className="flex items-center gap-5 lg:gap-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="MovieHaat home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#e50914] text-white shadow-[0_8px_24px_rgba(229,9,20,.25)]">
              <Film size={20} />
            </span>
            <span className="hidden text-lg font-bold tracking-[-0.04em] text-white min-[410px]:inline">
              Movie<span className="text-[#e50914]">Haat</span>
            </span>
          </Link>

          <nav
            className="flex items-center gap-3 text-xs font-medium text-[#a8b0c0] sm:gap-5 sm:text-sm"
            aria-label="Main navigation"
          >
            {navigation.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative py-2 transition-colors hover:text-white ${active ? "text-white" : ""}`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-3 h-0.5 rounded-full bg-[#e50914]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <form
          onSubmit={handleSearch}
          className="order-3 col-span-3 flex h-11 w-full items-center overflow-hidden rounded-xl border border-white/10 bg-[#121722] pl-4 pr-1.5 transition-colors focus-within:border-white/20 md:order-none md:col-span-1 md:max-w-2xl md:justify-self-center"
          role="search"
        >
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search movies..."
            aria-label="Search movies"
            className="h-full min-w-0 flex-1 border-0 bg-transparent pr-3 text-sm text-white outline-none focus:outline-none focus-visible:outline-none placeholder:text-[#737d91]"
          />
          <button
            type="submit"
            aria-label="Search"
            title="Search"
            className="grid h-8 w-9 shrink-0 place-items-center rounded-lg border-0 bg-transparent text-[#737d91] outline-none transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:outline-none"
          >
            <Search size={18} />
          </button>
        </form>

        <div className="relative" ref={accountMenuRef}>
          {isAuthenticated ? <button
            type="button"
            onClick={() => setAccountMenuOpen((open) => !open)}
            aria-label="Open account menu"
            aria-expanded={accountMenuOpen}
            className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/10 bg-[#121722] text-[#a8b0c0] transition hover:border-[#e50914] hover:text-white"
          >
            {user?.avatar?.url ? <img src={user.avatar.url} alt="" className="h-full w-full object-cover" /> : <UserCircle size={19} />}
          </button> : <Link to="/login" aria-label="Sign in" title="Sign in" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-[#121722] text-[#a8b0c0] transition hover:border-[#e50914] hover:bg-[#e50914] hover:text-white"><UserCircle size={19} /></Link>}

          {isAuthenticated && accountMenuOpen && <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#121722] p-2 shadow-[0_24px_60px_rgba(0,0,0,.55)]">
            <div className="border-b border-white/10 px-3 py-2.5"><p className="truncate text-sm font-semibold text-white">{user?.name || "Account"}</p><p className="truncate text-xs text-[#737d91]">{user?.email}</p></div>
            {user?.role === "admin" && <Link to="/admin/dashboard" className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#a8b0c0] transition hover:bg-white/5 hover:text-white"><LayoutDashboard size={17} /> Dashboard</Link>}
            <Link to="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#a8b0c0] transition hover:bg-white/5 hover:text-white"><UserCircle size={17} /> Profile</Link>
            <button type="button" onClick={() => dispatch(logout())} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#ff7b83] transition hover:bg-[#e50914]/10 hover:text-[#ff9ca2]"><LogOut size={17} /> Sign out</button>
          </div>}
        </div>
      </div>
    </header>
  );
};

export default Header;

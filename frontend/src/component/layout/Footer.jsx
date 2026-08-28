const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#080a0f] pb-20 lg:pb-0">
      <div className="container flex flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row sm:gap-6 sm:py-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs leading-5 text-[#737d91] sm:justify-start">
          <p>© {new Date().getFullYear()} MovieHaat. All rights reserved.</p>
          <a className="transition-colors hover:text-white" href="/about">About</a>
          <a className="transition-colors hover:text-white" href="/privacy">Privacy</a>
        </div>

        <p className="text-center text-xs leading-5 text-[#737d91] sm:text-right">
          Developed by{" "}
          <a
            href="https://digitalnexgen.co"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#a8b0c0] transition-colors hover:text-white"
          >
            Digital Nexgen
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

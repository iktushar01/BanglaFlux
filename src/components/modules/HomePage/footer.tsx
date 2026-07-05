"use client";

function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} NextStarter. All rights reserved.</p>
      </footer>
  );
}

export default Footer;
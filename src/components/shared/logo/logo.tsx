"use client";

import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Logo"
        width={120}
        height={32}
        className="rounded-md"
        priority
      />
    </Link>
  );
};

export default Logo;
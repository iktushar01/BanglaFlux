import Footer from "@/components/modules/HomePage/footer";
import Navbar from "@/components/modules/HomePage/navbar";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
import Image from "next/image";
import { Inter } from "next/font/google";
import HomeMain from "@/components/home/HomeMain";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`min-h-screen${inter.className}`}>
      <HomeMain />
    </main>
  );
}

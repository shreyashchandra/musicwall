import Appbar from "@/components/Appbar";
import HeroSection from "@/components/HeroSection";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <>
      <main>
        <Appbar />
        <HeroSection />
      </main>
    </>
  );
}

import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Discovery } from "@/components/sections/discovery";
import { OrderFlow } from "@/components/sections/order-flow";
import { Tracking } from "@/components/sections/tracking";
import { Restaurants } from "@/components/sections/restaurants";
import { Why } from "@/components/sections/why";
import { CtaFinal } from "@/components/sections/cta-final";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Discovery />
      <OrderFlow />
      <Tracking />
      <Restaurants />
      <Why />
      <CtaFinal />
    </main>
  );
}

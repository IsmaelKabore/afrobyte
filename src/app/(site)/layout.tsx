import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

/** Layout marketing : nav + footer. Les pages /v/* n'en héritent pas. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteNav />
      {children}
      <SiteFooter />
    </>
  );
}

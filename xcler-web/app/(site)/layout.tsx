import TopNoticeBar from "@/components/site/TopNoticeBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/GeistVF.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      <TopNoticeBar />
      {children}
    </>
  );
}

import { notFound } from "next/navigation";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/metadata";
import styles from "@/app/(site)/content.module.css";

const cityNames = ["germany", "berlin", "hamburg", "munich", "frankfurt", "cologne", "dusseldorf"] as const;

type City = (typeof cityNames)[number];
type Params = { city: string };

const cityLabel = (city: string) => city.charAt(0).toUpperCase() + city.slice(1);

export async function generateMetadata({ params }: { params: Params }) {
  const { city } = params;

  if (!cityNames.includes(city as City)) {
    return {};
  }

  return {
    ...buildPageMetadata({
      title: `Services in ${cityLabel(city)}`,
      description: `Xcler provides web development, automation, and AI systems in ${cityLabel(city)}.`,
      path: `/services/${city}`,
    }),
    alternates: {
      canonical: `https://xcler.dev/services/${city}`,
      languages: {
        de: `https://xcler.dev/services/${city}`,
        en: "https://xcler.dev",
        "x-default": "https://xcler.dev",
      },
    },
  };
}

export default async function ServiceCityPage({ params }: { params: Params }) {
  const { city } = params;

  if (!cityNames.includes(city as City)) {
    notFound();
  }

  const title = cityLabel(city);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: title, path: `/services/${city}` },
  ]);

  return (
    <main className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1>Services in {title}</h1>
      <p className={styles.lead}>
        Xcler supports teams in {title} with web development, app development, workflow automation, and AI systems.
      </p>
    </main>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integritetspolicy - Glada Fönster Städ AB",
  description:
    "Läs om hur Glada Fönster Städ AB samlar in, använder och skyddar dina personuppgifter i enlighet med GDPR.",
  alternates: {
    canonical: "https://gladafonster.se/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
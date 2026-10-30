import { Breadcrumb, type BreadcrumbProps as UIBreadcrumbProps } from "@refugies-info/ui";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import type React from "react";
import Layout from "~/components/Layout/Layout";

interface LegalPagesLayoutProps {
  children: React.ReactNode;
  history?: string[];
  title: string;
  BreadcrumbProps?: Omit<UIBreadcrumbProps, "className" | "currentPageLabel">;
}

export default function LegalPagesLayout({
  children,
  history = [],
  title,
  BreadcrumbProps = {
    segments: [],
  },
}: LegalPagesLayoutProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const pageHistory = history.length > 0 ? history : [router.asPath];

  return (
    <Layout history={pageHistory}>
      <div>
        <div className="fr-container w-full">
          <Breadcrumb
            className="w-full"
            segments={BreadcrumbProps.segments}
            currentPageLabel={title}
            homeLabel={t("homepage", "Accueil")}
          />
          <main className="mx-auto mb-10 w-full max-w-3xl">{children}</main>
        </div>
      </div>
    </Layout>
  );
}

import { Breadcrumb, type BreadcrumbProps as UIBreadcrumbProps } from "@refugies-info/ui";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/components/Layout/Layout";
import { HelpNotice } from "~/components/Pages/recherche/HelpNotice";

interface LegalPagesLayoutProps {
  children: React.ReactNode;
  history?: string[];
  BreadcrumbProps?: Omit<UIBreadcrumbProps, "className">;
}

export default function LegalPagesLayout({
  children,
  history = [],
  BreadcrumbProps = {
    segments: [],
    currentPageLabel: "",
  },
}: LegalPagesLayoutProps) {
  const router = useRouter();
  const pageHistory = history.length > 0 ? history : [router.asPath];

  return (
    <Layout history={pageHistory}>
      <div>
        <HelpNotice className="w-screen" />
        <div className="fr-container w-full">
          {BreadcrumbProps && (
            <Breadcrumb
              className="w-full"
              segments={BreadcrumbProps.segments || []}
              currentPageLabel={BreadcrumbProps.currentPageLabel || ""}
            />
          )}
          <main className="mx-auto mb-10 w-full max-w-3xl">{children}</main>
        </div>
      </div>
    </Layout>
  );
}

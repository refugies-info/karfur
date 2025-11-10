import { useRouter } from "next/router";
import React from "react";
import Layout from "~/components/Layout/Layout";

interface Page404LayoutProps {
  children: React.ReactNode;
  history?: string[];
}

export default function Page404Layout({ children, history = [] }: Page404LayoutProps) {
  const router = useRouter();
  const pageHistory = history.length > 0 ? history : [router.asPath];

  return (
    <Layout
      history={pageHistory}
      className="bg-alt-blue-france grid !min-h-0 w-full items-center justify-center py-10 md:py-20"
    >
      {children}
    </Layout>
  );
}

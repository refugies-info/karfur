import CheckCode from "@/components/Pages/auth/CheckCode";
import Layout from "@/components/Pages/auth/Layout";
import SEO from "@/components/Seo";
import { useAuthRedirect } from "@/hooks";
import { defaultStaticProps } from "@/lib/getDefaultStaticProps";
import { ReactElement } from "react";

const SecurityCode = () => {
  useAuthRedirect(true);

  return (
    <>
      <SEO title="Code de sécurité" />
      <CheckCode type="2fa" />
    </>
  );
};

export const getStaticProps = defaultStaticProps;
export default SecurityCode;

// override default layout and options
SecurityCode.getLayout = (page: ReactElement) => <Layout loginHelp>{page}</Layout>;

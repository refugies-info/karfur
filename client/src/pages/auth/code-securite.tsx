import { ReactElement } from "react";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import Layout from "components/Pages/auth/Layout";
import CheckCode from "components/Pages/auth/CheckCode";
import SEO from "components/Seo";
import { useAuthRedirect } from "hooks";

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
SecurityCode.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

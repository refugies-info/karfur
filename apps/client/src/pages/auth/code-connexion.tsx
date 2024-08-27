import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import CheckCode from "~/components/Pages/auth/CheckCode";
import Layout from "~/components/Pages/auth/Layout";
import SEO from "~/components/Seo";
import { useAuthRedirect } from "~/hooks";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";
import API from "~/utils/API";

const LoginCode = () => {
  useAuthRedirect(true);
  const router = useRouter();
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    const email = router.query.email as string;
    if (email && !codeSent) {
      setCodeSent(true);
      API.sendCode({ email });
    }
  }, [router, codeSent]);

  return (
    <>
      <SEO title="Code de connexion" />
      <CheckCode type="login" />
    </>
  );
};

export const getStaticProps = defaultStaticProps;
export default LoginCode;

// override default layout and options
LoginCode.getLayout = (page: ReactElement) => <Layout loginHelp>{page}</Layout>;

import { useRouter } from "next/router";
import { type ReactElement, useEffect, useState } from "react";
import CheckCode from "~/components/Pages/auth/CheckCode";
import Layout from "~/components/Pages/auth/Layout";
import SEO from "~/components/Seo";
import { useAuthRedirect, useSendCode } from "~/hooks";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";

const LoginCode = () => {
  useAuthRedirect(true);
  const router = useRouter();
  const email = router.query.email as string;
  const { sendCode } = useSendCode(email);
  const [codeSent, setCodeSent] = useState(false);

  // Going through the hook means a reload within 60s does not send a second email.
  useEffect(() => {
    if (email && !codeSent) {
      setCodeSent(true);
      sendCode();
    }
  }, [email, codeSent, sendCode]);

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

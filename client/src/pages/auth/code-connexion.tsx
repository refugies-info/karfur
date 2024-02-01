import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import API from "utils/API";
import Layout from "components/Pages/auth/Layout";
import CheckCode from "components/Pages/auth/CheckCode";

const LoginCode = () => {
  const router = useRouter();
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    const email = router.query.email as string;
    if (email && !codeSent) {
      setCodeSent(true);
      API.sendCode({ email });
    }
  }, [router, codeSent]);

  return <CheckCode type="login" />;
};

export const getStaticProps = defaultStaticProps;
export default LoginCode;

// override default layout and options
LoginCode.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

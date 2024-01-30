import { ReactElement, useEffect, useMemo, useState } from "react";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { logger } from "logger";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { useRegisterFlow } from "hooks";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import Error from "components/Pages/auth/Error";
import LogoCoallia from "assets/auth/structure-logos/structure-coallia.png";
import LogoPierreValdo from "assets/auth/structure-logos/structure-pierre-valdo.png";
import LogoFranceHorizon from "assets/auth/structure-logos/structure-france-horizon.png";
import LogoFtda from "assets/auth/structure-logos/structure-ftda.png";
import LogoGipHis from "assets/auth/structure-logos/structure-gip-his.png";
import LogoGroupeSos from "assets/auth/structure-logos/structure-groupe-sos.png";
import LogoMens from "assets/auth/structure-logos/structure-mens.png";
import LogoViltais from "assets/auth/structure-logos/structure-viltais.png";
import NoIcon from "assets/auth/no-icon.svg";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [partner, setPartner] = useState<string>("");
  const { userId, userDetails, getStepCount, next, back } = useRegisterFlow("partenaire");
  const stepCount = useMemo(() => getStepCount(null), [getStepCount]);

  useEffect(() => {
    if (userDetails?.partner) setPartner(userDetails.partner);
  }, [userDetails]);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      if (!userId || !partner) return;
      try {
        await API.updateUser(userId.toString(), {
          user: { partner },
          action: "modify-my-details",
        });
        next(null);
      } catch (e: any) {
        logger.error(e);
        setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
      }
    },
    [router, userId, next, partner],
  );

  if (!userId) return null;

  return (
    <div className={cls(styles.container, styles.full)}>
      <SEO title="Votre structure" />
      <div className={styles.container_inner}>
        <Button
          priority="tertiary"
          size="small"
          iconId="fr-icon-arrow-left-line"
          onClick={back}
          className={styles.back_button}
        >
          Retour
        </Button>

        <Stepper currentStep={stepCount[0]} stepCount={stepCount[1]} title="Votre structure" />

        <div className={cls(styles.title, "mt-14")}>
          <h1>Dans quelle structure êtes-vous&nbsp;?</h1>
          <p className={styles.subtitle}>
            Nous avons un partenariat avec ces structures, précisez nous si vous en faites partie.
          </p>
        </div>

        <form onSubmit={submit}>
          <RadioButtons
            name="partner"
            className={styles.radio}
            options={[
              {
                illustration: <Image alt="illustration" src={LogoCoallia} width={56} height={18} />,
                label: "Coallia",
                nativeInputProps: {
                  checked: partner === "coallia",
                  onChange: () => setPartner("coallia"),
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoPierreValdo} width={48} height={48} />,
                label: "Entraide Pierre Valdo",
                nativeInputProps: {
                  checked: partner === "pierre-valdo",
                  onChange: () => setPartner("pierre-valdo"),
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoFranceHorizon} width={56} height={46} />,
                label: "France Horizon",
                nativeInputProps: {
                  checked: partner === "france-horizon",
                  onChange: () => setPartner("france-horizon"),
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoFtda} width={56} height={34} />,
                label: "France Terre d'Asile",
                nativeInputProps: {
                  checked: partner === "ftda",
                  onChange: () => setPartner("ftda"),
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoGipHis} width={56} height={27} />,
                label: "GIP HIS",
                nativeInputProps: {
                  checked: partner === "gip-his",
                  onChange: () => setPartner("gip-his"),
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoGroupeSos} width={56} height={19} />,
                label: "Groupe SOS",
                nativeInputProps: {
                  checked: partner === "groupe-sos",
                  onChange: () => setPartner("groupe-sos"),
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoMens} width={56} height={21} />,
                label: "Mens",
                nativeInputProps: {
                  checked: partner === "mens",
                  onChange: () => setPartner("mens"),
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoViltais} width={56} height={19} />,
                label: "Viltaïs",
                nativeInputProps: {
                  checked: partner === "viltais",
                  onChange: () => setPartner("viltais"),
                },
              },
              {
                illustration: <Image alt="illustration" src={NoIcon} width={48} height={48} />,
                label: "Aucune de ces structures",
                nativeInputProps: {
                  checked: partner === "none",
                  onChange: () => setPartner("none"),
                },
              },
            ]}
          />

          <Error error={error} />

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={cls(styles.button, "mt-7")}
            nativeButtonProps={{ type: "submit" }}
            disabled={loading}
          >
            Suivant
          </Button>
        </form>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthLogin;

// override default layout and options
AuthLogin.getLayout = (page: ReactElement) => <Layout fullWidth>{page}</Layout>;

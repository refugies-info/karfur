import { ReactElement, useCallback, useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { logger } from "logger";
import { getPath } from "routes";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { userIdSelector } from "services/User/user.selectors";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { fetchUserActionCreator } from "services/User/user.actions";
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
  const dispatch = useDispatch();
  const userId = useSelector(userIdSelector);
  const isUserLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId && !isUserLoading) dispatch(fetchUserActionCreator());
  }, [userId, isUserLoading, dispatch]);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      const partner = e.target.partner.value;
      if (!userId || !partner) return;
      try {
        await API.updateUser(userId.toString(), {
          user: { partner },
          action: "modify-my-details",
        });
        router.push(getPath("/auth/inscription/territoire", "fr"));
      } catch (e: any) {
        logger.error(e);
        setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
      }
    },
    [router, userId],
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
          onClick={() => router.back()}
          className={styles.back_button}
        >
          Retour
        </Button>

        <Stepper currentStep={2} stepCount={3} title="Votre structure" />

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
                  value: "coallia",
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoPierreValdo} width={48} height={48} />,
                label: "Entraide Pierre Valdo",
                nativeInputProps: {
                  value: "pierre-valdo",
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoFranceHorizon} width={56} height={46} />,
                label: "France Horizon",
                nativeInputProps: {
                  value: "france-horizon",
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoFtda} width={56} height={34} />,
                label: "France Terre d'Asile",
                nativeInputProps: {
                  value: "ftda",
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoGipHis} width={56} height={27} />,
                label: "GIP HIS",
                nativeInputProps: {
                  value: "gip-his",
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoGroupeSos} width={56} height={19} />,
                label: "Groupe SOS",
                nativeInputProps: {
                  value: "groupe-sos",
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoMens} width={56} height={21} />,
                label: "Mens",
                nativeInputProps: {
                  value: "mens",
                },
              },
              {
                illustration: <Image alt="illustration" src={LogoViltais} width={56} height={19} />,
                label: "Viltaïs",
                nativeInputProps: {
                  value: "viltais",
                },
              },
              {
                illustration: <Image alt="illustration" src={NoIcon} width={48} height={48} />,
                label: "Aucune de ces structures",
                nativeInputProps: {
                  value: "other",
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

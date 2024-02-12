import { ReactElement, useEffect, useMemo, useState } from "react";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import Image from "next/image";
import { RoleName } from "@refugies-info/api-types";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { logger } from "logger";
import API from "utils/API";
import { hasRole } from "lib/hasRole";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { useRegisterFlow } from "hooks";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import PartnerRadio from "components/Pages/auth/PartnerRadio";
import ErrorMessage from "components/UI/ErrorMessage";
import NoIcon from "assets/auth/no-icon.svg";
import styles from "scss/components/auth.module.scss";
import { partners } from "data/structurePartners";

const AuthLogin = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [partner, setPartner] = useState<string | null>(null);
  const { userId, userDetails, getStepCount, next } = useRegisterFlow("partenaire");
  const stepCount = useMemo(() => getStepCount(partner === "" ? null : [RoleName.CAREGIVER]), [partner, getStepCount]);

  useEffect(() => {
    if (userDetails?.partner) setPartner(userDetails.partner);
    else if (!hasRole(userDetails, RoleName.CAREGIVER)) setPartner("");
  }, [userDetails]);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      if (!userId || partner === null) return;
      try {
        await API.updateUser(userId.toString(), {
          user: { partner },
          action: "modify-my-details",
        });
        next(partner === "" ? null : [RoleName.CAREGIVER]);
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
        <Stepper currentStep={stepCount[0]} stepCount={stepCount[1]} title={null} />

        <div className={cls(styles.title, styles.sm, "mt-12")}>
          <h1>Dans quelle structure êtes-vous&nbsp;?</h1>
          <p className={styles.subtitle}>
            Nous avons un partenariat national avec ces structures. Si vous n’en faites pas partie, cochez « Aucune de
            ces structures ».
          </p>
        </div>

        <form onSubmit={submit}>
          <PartnerRadio
            id="partner-input"
            name="partner"
            className={cls(styles.radio, "mb-0")}
            options={[
              ...partners.map((option) => ({
                illustration: (
                  <Image alt="illustration" src={option.image} width={option.width} height={option.height} />
                ),
                label: option.name,
                nativeInputProps: {
                  checked: partner === option.name,
                  onChange: () => setPartner(option.name),
                },
              })),
              {
                illustration: <Image alt="illustration" src={NoIcon} width={48} height={48} />,
                label: "Aucune de ces structures",
                fullWidth: true,
                nativeInputProps: {
                  checked: partner === "",
                  onChange: () => setPartner(""),
                },
              },
            ]}
          />

          <ErrorMessage error={error} />

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={cls(styles.button, "mt-9")}
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

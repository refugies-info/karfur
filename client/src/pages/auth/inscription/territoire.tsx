import { ReactElement, useEffect, useMemo, useState } from "react";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { logger } from "logger";
import API from "utils/API";
import { useDepartmentAutocomplete, useRegisterFlow } from "hooks";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { getLoginRedirect } from "lib/loginRedirect";
import { formatDepartment } from "lib/departments";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import Error from "components/Pages/auth/Error";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // submit and loading
  const router = useRouter();
  const [error, setError] = useState("");
  const { userDetails, getStepCount, back } = useRegisterFlow("territoire");
  const stepCount = useMemo(() => getStepCount(null), [getStepCount]);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      if (!userDetails || selectedDepartments.length === 0) return;
      try {
        await API.updateUser(userDetails._id.toString(), {
          user: { departments: selectedDepartments },
          action: "modify-my-details",
        });
        router.push(getLoginRedirect(userDetails?.roles));
      } catch (e: any) {
        logger.error(e);
        setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
      }
    },
    [router, userDetails, selectedDepartments],
  );

  // department input
  useEffect(() => {
    if (userDetails?.departments) setSelectedDepartments(userDetails.departments);
  }, [userDetails]);

  const { search, setSearch, hidePredictions, setHidePredictions, getPlaceSelected, predictions } =
    useDepartmentAutocomplete();

  const handleChange = (e: any) => setSearch(e.target.value);
  const onPlaceSelected = async (id: string) => {
    const place = await getPlaceSelected(id);
    if (!place) return;
    if (!selectedDepartments.includes(place)) {
      const newDeps = [...(selectedDepartments || []), place];
      setSelectedDepartments(newDeps);
      setHidePredictions(true);
      setSearch("");
    }
  };
  if (!userDetails) return null;

  return (
    <div className={cls(styles.container, styles.full)}>
      <SEO title="Votre territoire" />
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

        <Stepper currentStep={stepCount[0]} stepCount={stepCount[1]} title="Votre territoire" />

        <div className={cls(styles.title, "mt-14")}>
          <h1>Où souhaitez-vous chercher des dispositifs&nbsp;?</h1>
          <p className={styles.subtitle}>
            Nous vous montrerons uniquement les contenus susceptibles de vous intéresser. Pas d’inquiétude, vous pourrez
            toujours modifier !
          </p>
        </div>

        <form onSubmit={submit}>
          <label htmlFor="location" className="mb-2">
            Nom ou numéro du département(s)
          </label>
          <div className="position-relative">
            <SearchBar
              renderInput={({ className, id, placeholder, type }) => (
                <input
                  className={className}
                  name="location"
                  id={id}
                  placeholder={placeholder}
                  type={type}
                  value={search}
                  onChange={handleChange}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setHidePredictions(true);
                    }
                  }}
                />
              )}
            />
            {!!(!hidePredictions && predictions?.length) && (
              <div className={styles.suggestions}>
                {predictions.slice(0, 5).map((p, i) => (
                  <button
                    key={i}
                    onClick={(e: any) => {
                      e.preventDefault();
                      onPlaceSelected(p.id);
                    }}
                  >
                    {p.text}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-14">
              {selectedDepartments.map((dep, i) => (
                <div key={dep} className={styles.option}>
                  {formatDepartment(dep)}
                  <Button
                    iconId="fr-icon-close-line"
                    priority="tertiary no outline"
                    title="Retirer le département"
                    size="small"
                    onClick={() => setSelectedDepartments((deps) => deps?.filter((d) => d !== dep))}
                  />
                </div>
              ))}
            </div>
          </div>

          <Error error={error} />

          <Button
            iconId="fr-icon-check-line"
            iconPosition="right"
            className={cls(styles.button, "mt-14")}
            nativeButtonProps={{ type: "submit" }}
            disabled={loading || selectedDepartments.length === 0}
          >
            Valider
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

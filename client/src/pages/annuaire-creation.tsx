import React, { useState, useEffect } from "react";
import { Spinner } from "reactstrap";
import FButton from "components/UI/FButton/FButton";
import { useRouter } from "next/router";
import { AnnuaireGauge } from "components/Pages/annuaire-create/AnnuaireGauge";
import { Step1 } from "components/Pages/annuaire-create/Step1";
import { Step2 } from "components/Pages/annuaire-create/Step2";
import { Step3 } from "components/Pages/annuaire-create/Step3";
import { Step4 } from "components/Pages/annuaire-create/Step4";
import { Step5 } from "components/Pages/annuaire-create/Step5";
import { Step6 } from "components/Pages/annuaire-create/Step6";
import { FrameModal } from "components/Modals";
import { Modifications } from "components/Pages/annuaire-create/Modifications";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedStructureIdSelector,
  selectedStructureSelector
} from "services/SelectedStructure/selectedStructure.selector";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { defaultStaticPropsWithThemes } from "lib/getDefaultStaticProps";
import { Structure } from "types/interface";
import styles from "scss/pages/annuaire-create.module.scss";
import SEO from "components/Seo";
import {
  setSelectedStructureActionCreator,
  updateSelectedStructureActionCreator
} from "services/SelectedStructure/selectedStructure.actions";

const AnnuaireCreate = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showTutoModal, setShowTutoModal] = useState(false);
  const [hasModifications, setHasModifications] = useState(false);

  const dispatch = useDispatch();
  const structureId = useSelector(selectedStructureIdSelector);
  const structure = useSelector(selectedStructureSelector);

  const isLoadingFetch = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_STRUCTURE));

  const isLoadingUpdate = useSelector(isLoadingSelector(LoadingStatusKey.UPDATE_SELECTED_STRUCTURE));
  const isLoading = isLoadingUpdate || isLoadingFetch;

  const toggleTutorielModal = () => setShowTutoModal(!showTutoModal);

  const getStepDescription = () => {
    if (step === 1) return "Vérification de l'identité de votre structure";
    if (step === 2) return "Sites et réseaux";
    if (step === 3) return "Activités";
    if (step === 5) return "Description";
    if (step > 5) return "Bien joué !";
    return "";
  };

  const updateStructure = () => {
    dispatch(updateSelectedStructureActionCreator({ locale: router.locale || "fr" }));
  };

  const setStructure = (structure: Structure) => {
    dispatch(setSelectedStructureActionCreator(structure));
  };

  const onStepValidate = () => {
    updateStructure();
    setStep(step + 1);
    setHasModifications(false);
    window.scrollTo(0, 0);
  };

  const onBackClick = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // at the begining we do not show modifications
  const showModifications = step !== 1 || hasModifications;

  return (
    <div className={styles.container}>
      <SEO title="Annuaire" />
      <div className={styles.left}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Annuaire</h1>
            {step !== 4 && <div className={styles.step}>{getStepDescription()}</div>}
            {step === 4 && (
              <div className={styles.step}>
                Contacts <br /> et infos pratiques
              </div>
            )}
          </div>
          <div className={styles.btn_container}>
            <FButton type="tuto" name={"play-circle-outline"} onClick={toggleTutorielModal} />
            <div>
              {step === 1 ? (
                <FButton
                  type={"white"}
                  name="close-outline"
                  onClick={() => router.push("/backend/user-dash-structure")}
                >
                  Quitter
                </FButton>
              ) : (
                <FButton type={"white"} name="arrow-back-outline" onClick={onBackClick}>
                  Retour
                </FButton>
              )}

              {step < 6 ? (
                isLoading ? (
                  <FButton type={"validate"} className="ms-2" onClick={onStepValidate} disabled={true}>
                    <Spinner className="me-2" size="sm" />
                    Suivant
                  </FButton>
                ) : (
                  <FButton
                    type={"validate"}
                    name="arrow-forward-outline"
                    className="ms-2"
                    onClick={onStepValidate}
                    disabled={isLoading}
                  >
                    Suivant
                  </FButton>
                )
              ) : (
                <FButton
                  type={"validate"}
                  name="done-all-outline"
                  className="ms-2"
                  onClick={() => router.push("/annuaire/" + structureId)}
                >
                  Terminer
                </FButton>
              )}
            </div>
          </div>
        </div>
        {showModifications && hasModifications && <Modifications hasModifications={hasModifications} />}
      </div>

      <div className={styles.right}>
        {!isLoading && (
          <>
            <AnnuaireGauge step={step} />
            {step === 1 && (
              <Step1 structure={structure} setStructure={setStructure} setHasModifications={setHasModifications} />
            )}
            {step === 2 && (
              <Step2 structure={structure} setStructure={setStructure} setHasModifications={setHasModifications} />
            )}
            {step === 3 && (
              <Step3 structure={structure} setStructure={setStructure} setHasModifications={setHasModifications} />
            )}

            {step === 4 && (
              <Step4 structure={structure} setStructure={setStructure} setHasModifications={setHasModifications} />
            )}
            {step === 5 && (
              <Step5 structure={structure} setStructure={setStructure} setHasModifications={setHasModifications} />
            )}
            {step === 6 && <Step6 structureId={structure ? structure._id : ""} />}
          </>
        )}
        {isLoading && (
          <div className={styles.loader}>
            <Spinner />
          </div>
        )}
      </div>
      {showTutoModal && <FrameModal show={showTutoModal} toggle={toggleTutorielModal} section={"Annuaire"} />}
    </div>
  );
};

export const getStaticProps = defaultStaticPropsWithThemes;

export default AnnuaireCreate;

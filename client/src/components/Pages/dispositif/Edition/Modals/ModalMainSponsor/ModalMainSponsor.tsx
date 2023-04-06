import React, { useCallback, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { CreateDispositifRequest, Id, Sponsor } from "api-types";
import { userSelector } from "services/User/user.selectors";
import { BaseModal } from "components/Pages/dispositif";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { help } from "./data";
import SearchStructure from "./SearchStructure";
import ChooseStructure from "./ChooseStructure";
import StructureContact from "./StructureContact";
import CreateStructure from "./CreateStructure";
import AuthorContact from "./AuthorContact";
import MemberOfStructure from "./MemberOfStructure";
import ThanksMessage from "./ThanksMessage";
import { SimpleFooter, StepsFooter } from "../components";
import {
  getDisplayedMaxStep,
  getDisplayedStep,
  getIsEndModal,
  getPreviousStep,
  getTitle,
  isNextButtonDisabled,
} from "./functions";
import styles from "./ModalMainSponsor.module.scss";

export type ContactInfos = {
  name: string;
  email: string;
  phone: string;
  comments: string;
};

const titleIcon = (
  <EVAIcon name="checkmark-circle-2" size={32} fill={styles.lightTextDefaultSuccess} className="me-2" />
);

interface Props {
  show: boolean;
  toggle: () => void;
}

const ModalMainSponsor = ({ show, toggle }: Props) => {
  const user = useSelector(userSelector);
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();

  const [step, setStep] = useState(0);
  const [selectedStructure, setSelectedStructure] = useState<Id | null>(getValues("mainSponsor") || null);
  const [createStructure, setCreateStructure] = useState(false);
  const [memberOfStructure, setMemberOfStructure] = useState<boolean | null>(null);
  const [otherStructure, setOtherStructure] = useState<boolean | null>(null);
  const [unknownContact, setUnknownContact] = useState<boolean | null>(null);
  // TODO: get infos from somewhere
  const [contact, setContact] = useState<ContactInfos>({
    name: "",
    email: "",
    phone: "",
    comments: "",
  });
  const [mainSponsor, setMainSponsor] = useState<Sponsor>({
    name: "",
    link: "",
    logo: {
      imgId: "",
      public_id: "",
      secure_url: "",
    },
  });

  const setData = () => {
    if (selectedStructure) {
      setValue("mainSponsor", selectedStructure.toString());
    } else if (!!mainSponsor.name && !!mainSponsor.link && !!mainSponsor.logo.secure_url) {
      setValue("mainSponsor", mainSponsor);
    }

    if (!!contact.name && !!contact.email && !!contact.phone) {
      const isStructureContact = unknownContact !== true;
      setValue("contact", { ...contact, isStructureContact });
    }
  };

  const goToNextStep = () => {
    if (user.hasStructure) {
      /* [step] ([condition]) [component]
      0 ChooseStructure
        1 (existing) quit
        2 (otherStructure) SearchStructure
          3 (found) ThanksMessage
          4 (notFound) CreateStructure
          5 StructureContact
            6 (formOk) ThanksMessage
            7 (unknownContact) AuthorContact
              8 ThanksMessage */
      if (step === 0) {
        if (otherStructure) setStep(2);
        else toggle();
      } else if (step === 2) {
        setStep(createStructure ? 4 : 3);
      } else if (step === 5) {
        setStep(unknownContact ? 7 : 6);
      } else {
        setStep((s) => s + 1);
      }
    } else {
      /* [step] ([condition]) [component]
      0 SearchStructure
        1 (found) MemberOfStructure
          2 (yes) AuthorContact
            3 ThanksMessage
          4 (no) ThanksMessage
        5 (notFound) CreateStructure
          6 MemberOfStructure
            7 (yes) AuthorContact
              8 ThanksMessage
            9 (no) StructureContact
              10 (formOk) ThanksMessage
              11 (unknownContact) AuthorContact
                12 ThanksMessage */
      if (step === 0) {
        setStep(createStructure ? 5 : 1);
      } else if (step === 1) {
        setStep(memberOfStructure ? 2 : 4);
      } else if (step === 6) {
        setStep(memberOfStructure ? 7 : 9);
      } else if (step === 9) {
        setStep(unknownContact ? 11 : 10);
      } else {
        setStep((s) => s + 1);
      }
    }

    setData();
  };

  const displayedStep = useMemo(() => getDisplayedStep(step, user.hasStructure), [step, user.hasStructure]);
  const displayedMaxStep = useMemo(() => getDisplayedMaxStep(step, user.hasStructure), [step, user.hasStructure]);
  const previousStep = useMemo(() => getPreviousStep(step, user.hasStructure), [step, user.hasStructure]);
  const isEndModal = useMemo(() => getIsEndModal(step, user.hasStructure), [step, user.hasStructure]);
  const title = useMemo(
    () => getTitle(step, user.hasStructure, isEndModal, titleIcon),
    [step, user.hasStructure, isEndModal],
  );
  const nextButtonDisabled = useMemo(
    () =>
      isNextButtonDisabled(
        step,
        user.hasStructure,
        contact,
        mainSponsor,
        memberOfStructure,
        selectedStructure,
        otherStructure,
        createStructure,
        unknownContact,
      ),
    [
      step,
      user.hasStructure,
      contact,
      mainSponsor,
      memberOfStructure,
      selectedStructure,
      otherStructure,
      createStructure,
      unknownContact,
    ],
  );

  const endForm = useCallback(() => {
    toggle();
    setStep(0);
  }, [toggle]);

  return (
    <BaseModal
      show={show}
      toggle={toggle}
      help={isEndModal ? undefined : help}
      title={title}
      small={isEndModal}
      className={styles.container}
    >
      {user.hasStructure ? (
        <div>
          {step === 0 && (
            <ChooseStructure
              selectedStructure={selectedStructure}
              setSelectedStructure={setSelectedStructure}
              otherStructure={otherStructure}
              setOtherStructure={setOtherStructure}
            />
          )}
          {step === 2 && (
            <SearchStructure
              selectedStructure={selectedStructure}
              setSelectedStructure={setSelectedStructure}
              createStructure={createStructure}
              setCreateStructure={setCreateStructure}
            />
          )}
          {step === 3 && <ThanksMessage />}
          {step === 4 && <CreateStructure sponsor={mainSponsor} setSponsor={setMainSponsor} />}
          {step === 5 && (
            <StructureContact
              contact={contact}
              setContact={setContact}
              unknownContact={unknownContact}
              setUnknownContact={setUnknownContact}
            />
          )}
          {step === 6 && <ThanksMessage />}
          {step === 7 && <AuthorContact contact={contact} setContact={setContact} />}
          {step === 8 && <ThanksMessage />}

          {isEndModal ? (
            <SimpleFooter onValidate={endForm} disabled={false} text="C'est noté&nbsp;!" />
          ) : (
            <StepsFooter
              onValidate={goToNextStep}
              onPrevious={() => setStep(previousStep)}
              maxSteps={displayedMaxStep}
              step={displayedStep}
              disabled={nextButtonDisabled}
              previousOnFirst
            />
          )}
        </div>
      ) : (
        <div>
          {step === 0 && (
            <SearchStructure
              selectedStructure={selectedStructure}
              setSelectedStructure={setSelectedStructure}
              createStructure={createStructure}
              setCreateStructure={setCreateStructure}
            />
          )}
          {step === 1 && (
            <MemberOfStructure memberOfStructure={memberOfStructure} setMemberOfStructure={setMemberOfStructure} />
          )}
          {step === 2 && <AuthorContact contact={contact} setContact={setContact} />}
          {step === 3 && <ThanksMessage />}
          {step === 4 && <ThanksMessage />}
          {step === 5 && <CreateStructure sponsor={mainSponsor} setSponsor={setMainSponsor} />}
          {step === 6 && (
            <MemberOfStructure memberOfStructure={memberOfStructure} setMemberOfStructure={setMemberOfStructure} />
          )}
          {step === 7 && <AuthorContact contact={contact} setContact={setContact} />}
          {step === 8 && <ThanksMessage />}
          {step === 9 && (
            <StructureContact
              contact={contact}
              setContact={setContact}
              unknownContact={unknownContact}
              setUnknownContact={setUnknownContact}
            />
          )}
          {step === 10 && <ThanksMessage />}
          {step === 11 && <AuthorContact contact={contact} setContact={setContact} />}
          {step === 12 && <ThanksMessage />}

          {isEndModal ? (
            <SimpleFooter onValidate={endForm} disabled={false} text="C'est noté&nbsp;!" />
          ) : (
            <StepsFooter
              onValidate={goToNextStep}
              onPrevious={() => setStep(previousStep)}
              maxSteps={displayedMaxStep}
              step={displayedStep}
              disabled={nextButtonDisabled}
              previousOnFirst
            />
          )}
        </div>
      )}
    </BaseModal>
  );
};

export default ModalMainSponsor;

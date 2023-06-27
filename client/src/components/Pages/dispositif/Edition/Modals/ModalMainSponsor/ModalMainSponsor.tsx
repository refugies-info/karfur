import React, { useCallback, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { CreateDispositifRequest, Id, Sponsor } from "@refugies-info/api-types";
import { userSelector } from "services/User/user.selectors";
import { userStructureSelector } from "services/UserStructure/userStructure.selectors";
import { BaseModal } from "components/Pages/dispositif";
import { defaultContact, defaultSponsor } from "./data";
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
  getInitialStep,
  getIsEndModal,
  getPreviousStep,
  getTextContent,
  isNextButtonDisabled,
} from "./functions";
import styles from "./ModalMainSponsor.module.scss";

export type ContactInfos = {
  name: string;
  email: string;
  phone?: string;
  comments: string;
};

interface Props {
  show: boolean;
  toggle: () => void;
}

const ModalMainSponsor = ({ show, toggle }: Props) => {
  const user = useSelector(userSelector);
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();
  const userStructure = useSelector(userStructureSelector);
  const [selectedStructure, setSelectedStructure] = useState<Id | null>(getValues("mainSponsor") || null);
  const [step, setStep] = useState(getInitialStep(selectedStructure, userStructure?._id || null));
  const [createStructure, setCreateStructure] = useState(false);
  const [memberOfStructure, setMemberOfStructure] = useState<boolean | null>(null);
  const [otherStructure, setOtherStructure] = useState<boolean | null>(null);
  const [unknownContact, setUnknownContact] = useState<boolean | null>(null);
  const [authorContact, setAuthorContact] = useState<ContactInfos>({
    ...defaultContact,
    email: user.user?.email || "",
  });
  const [structureContact, setStructureContact] = useState<ContactInfos>(defaultContact);
  const [mainSponsor, setMainSponsor] = useState<Sponsor>(defaultSponsor);

  const goToInitialStep = useCallback(() => {
    setStep(getInitialStep(selectedStructure, userStructure?._id || null));
  }, [selectedStructure, userStructure]);

  const setData = useCallback(() => {
    if (selectedStructure) {
      setValue("mainSponsor", selectedStructure.toString());
    } else if (!!mainSponsor.name && !!mainSponsor.link && !!mainSponsor.logo.secure_url) {
      setValue("mainSponsor", mainSponsor);
    }

    if (!!authorContact.name && !!authorContact.phone && !!authorContact.email) {
      setValue("contact", {
        ...authorContact,
        isMember: !unknownContact,
        isMe: true,
      });
    } else if (!!structureContact.name) {
      setValue("contact", {
        ...structureContact,
        isMember: false,
        isMe: false,
      });
    }
  }, [authorContact, mainSponsor, selectedStructure, setValue, structureContact, unknownContact]);

  const endForm = useCallback(() => {
    toggle();
    setStep(0);
    setCreateStructure(false);
    setMemberOfStructure(null);
    setOtherStructure(null);
    setUnknownContact(null);
    setAuthorContact(defaultContact);
    setStructureContact(defaultContact);
    setMainSponsor(defaultSponsor);
  }, [toggle]);

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
        if (otherStructure) {
          setStep(2);
        } else {
          setData();
          endForm();
        }
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
  };

  const displayedStep = useMemo(
    () => getDisplayedStep(step, user.hasStructure, createStructure, unknownContact, memberOfStructure),
    [step, user.hasStructure, createStructure, unknownContact, memberOfStructure],
  );
  const displayedMaxStep = useMemo(
    () => getDisplayedMaxStep(step, user.hasStructure, createStructure, unknownContact, memberOfStructure),
    [step, user.hasStructure, createStructure, unknownContact, memberOfStructure],
  );
  const previousStep = useMemo(() => getPreviousStep(step, user.hasStructure), [step, user.hasStructure]);
  const isEndModal = useMemo(() => getIsEndModal(step, user.hasStructure), [step, user.hasStructure]);
  const textContent = useMemo(() => getTextContent(step, user.hasStructure), [step, user.hasStructure]);
  const nextButtonDisabled = useMemo(
    () =>
      isNextButtonDisabled(
        step,
        user.hasStructure,
        authorContact,
        structureContact,
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
      authorContact,
      structureContact,
      mainSponsor,
      memberOfStructure,
      selectedStructure,
      otherStructure,
      createStructure,
      unknownContact,
    ],
  );

  return (
    <BaseModal
      show={show}
      toggle={endForm}
      help={textContent.help}
      title={textContent.title}
      small={isEndModal}
      onOpened={goToInitialStep}
    >
      {user.hasStructure ? (
        <div className={styles.container}>
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
          {step === 3 && <ThanksMessage publish={setData} content={textContent.content} />}
          {step === 4 && <CreateStructure sponsor={mainSponsor} setSponsor={setMainSponsor} />}
          {step === 5 && (
            <StructureContact
              contact={structureContact}
              setContact={setStructureContact}
              unknownContact={unknownContact}
              setUnknownContact={setUnknownContact}
            />
          )}
          {step === 6 && <ThanksMessage publish={setData} content={textContent.content} />}
          {step === 7 && <AuthorContact contact={authorContact} setContact={setAuthorContact} />}
          {step === 8 && <ThanksMessage publish={setData} content={textContent.content} />}

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
        <div className={styles.container}>
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
          {step === 2 && <AuthorContact contact={authorContact} setContact={setAuthorContact} />}
          {step === 3 && <ThanksMessage publish={setData} content={textContent.content} />}
          {step === 4 && <ThanksMessage publish={setData} content={textContent.content} />}
          {step === 5 && <CreateStructure sponsor={mainSponsor} setSponsor={setMainSponsor} />}
          {step === 6 && (
            <MemberOfStructure memberOfStructure={memberOfStructure} setMemberOfStructure={setMemberOfStructure} />
          )}
          {step === 7 && <AuthorContact contact={authorContact} setContact={setAuthorContact} />}
          {step === 8 && <ThanksMessage publish={setData} content={textContent.content} />}
          {step === 9 && (
            <StructureContact
              contact={structureContact}
              setContact={setStructureContact}
              unknownContact={unknownContact}
              setUnknownContact={setUnknownContact}
            />
          )}
          {step === 10 && <ThanksMessage publish={setData} content={textContent.content} />}
          {step === 11 && <AuthorContact contact={authorContact} setContact={setAuthorContact} />}
          {step === 12 && <ThanksMessage publish={setData} content={textContent.content} />}

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

import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "reactstrap";
import {
  UserStructure,
  DetailedOpeningHours,
} from "types/interface";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FInput from "components/UI/FInput/FInput";
import { days } from "data/days";
import { departments } from "data/departments";
import { HoursDetails } from "./HoursDetails";
import { CustomDropDown } from "./CustomDropdown";
import { CustomCheckBox } from "./CustomCheckBox";
import { AddButton } from "./Step2";

interface Props {
  structure: UserStructure | null;
  setStructure: (arg: any) => void;
  setHasModifications: (arg: boolean) => void;
}

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 16px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 24px;
  margin-bottom: 48px;
`;

const HelpContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: #2d9cdb;
  border-radius: 12px;
  width: 740px;
  padding: 16px;
  margin-bottom: 24px;
  position: relative;
`;

const HelpDescription = styled.div`
  line-height: 28px;
  color: #fbfbfb;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
`;

const DepartmentContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const CheckboxContainer = styled.div`
  background: ${(props: {checked: boolean}) => (props.checked ? "#DEF7C2" : "#f2f2f2")};
  border-radius: 12px;
  width: fit-content;
  padding: 14px;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  color: #828282;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Subtitle = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 12px;
`;

const SelectedContainer = styled.div`
  background: #8bc34a;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
  padding: 15px;
  width: fit-content;
  heigth: 50px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  margin-right: 8px;
`;
const DeleteIconContainer = styled.div`
  background: #212121;
  height: 50px;
  width: 50px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
export const Step4 = (props: Props) => {
  const [showHelp, setShowHelp] = useState(true);
  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentInput, setDepartmentInput] = useState("");

  const [show1PhoneInput, setshow1PhoneInput] = useState(false);
  const [show2PhoneInput, setshow2PhoneInput] = useState(false);

  const toggle1PhoneInput = () => setshow1PhoneInput((prevState) => !prevState);

  const toggle2PhoneInput = () => setshow2PhoneInput((prevState) => !prevState);

  const [show1MailInput, setshow1MailInput] = useState(false);
  const [show2MailInput, setshow2MailInput] = useState(false);

  const toggle1MailInput = () => setshow1MailInput((prevState) => !prevState);

  const toggle2MailInput = () => setshow2MailInput((prevState) => !prevState);

  const onDepartmentChange = (e: any) => {
    setDepartmentInput(e.target.value);
    if (e.target.value === "") {
      return setDepartments([]);
    }
    const departmentsDataFiltered = departments.filter((department) =>
      props.structure && props.structure.departments
        ? !props.structure.departments.includes(department)
        : false
    );

    const filteredDepartments = departmentsDataFiltered.filter((department) =>
      department.toLowerCase().includes(e.target.value.toLowerCase())
    );

    // @ts-ignore
    setDepartments(filteredDepartments);
  };

  const onChange = (e: any) => {
    props.setHasModifications(true);
    return props.setStructure({
      ...props.structure,
      [e.target.id]: e.target.value,
    });
  };

  const removeDropdowElement = (element: string) => {
    const departments =
      props.structure && props.structure.departments
        ? props.structure.departments.filter(
            (department) => department !== element
          )
        : [];
    props.setStructure({ ...props.structure, departments });
    props.setHasModifications(true);
  };

  const handleCheckboxChange = () => {
    props.setHasModifications(true);

    if (
      props.structure &&
      props.structure.departments &&
      props.structure.departments[0] === "All"
    ) {
      return props.setStructure({
        ...props.structure,
        departments: [],
      });
    }
    return props.setStructure({
      ...props.structure,
      departments: ["All"],
    });
  };

  const handleRdvCheckboxChange = () => {
    props.setHasModifications(true);

    if (props.structure && props.structure.onlyWithRdv) {
      return props.setStructure({
        ...props.structure,
        onlyWithRdv: false,
      });
    } else if (props.structure && !props.structure.onlyWithRdv) {
      return props.setStructure({
        ...props.structure,
        onlyWithRdv: true,
      });
    }
  };

  const handlePublicCheckboxChange = () => {
    props.setHasModifications(true);

    if (
      props.structure &&
      props.structure.openingHours &&
      props.structure.openingHours.noPublic
    ) {
      if (props.structure.openingHours.precisions) {
        return props.setStructure({
          ...props.structure,
          openingHours: {
            details: [],
            noPublic: false,
            precisions: props.structure.openingHours.precisions,
          },
        });
      }
      return props.setStructure({
        ...props.structure,
        openingHours: { details: [], noPublic: false },
      });
    }

    if (
      props.structure &&
      props.structure.openingHours &&
      props.structure.openingHours.precisions
    ) {
      return props.setStructure({
        ...props.structure,
        openingHours: {
          details: [],
          noPublic: true,
          precisions: props.structure.openingHours.precisions,
        },
      });
    }

    return props.setStructure({
      ...props.structure,
      openingHours: { details: [], noPublic: true },
    });
  };

  const onDropdownElementClick = (element: string) => {
    props.setHasModifications(true);

    const departments = props.structure
      ? !props.structure.departments
        ? [element]
        : props.structure.departments.concat([element])
      : [];
    props.setStructure({ ...props.structure, departments });
    setDepartments([]);
    setDepartmentInput("");
  };

  const getPhones = (
    previousPhones: string[] | undefined,
    id: string,
    value: string
  ) => {
    if (id === "phone0") {
      if (
        !previousPhones ||
        previousPhones.length === 0 ||
        !previousPhones[1]
      ) {
        return [value];
      }
      return [value, previousPhones[1]];
    }
    if (!previousPhones) return [value];

    return [previousPhones[0], value];
  };

  const getMails = (
    previousMails: string[] | undefined,
    id: string,
    value: string
  ) => {
    if (id === "mail0") {
      if (!previousMails || previousMails.length === 0 || !previousMails[1]) {
        return [value];
      }
      return [value, previousMails[1]];
    }
    if (!previousMails) return [value];
    return [previousMails[0], value];
  };

  const onPhoneChange = (e: any) => {
    const phones = props.structure
      ? getPhones(props.structure.phonesPublic, e.target.id, e.target.value)
      : [];
    props.setStructure({ ...props.structure, phonesPublic: phones });
    props.setHasModifications(true);
  };

  const onMailChange = (e: any) => {
    const mails = props.structure
      ? getMails(props.structure.mailsPublic, e.target.id, e.target.value)
      : [];
    props.setStructure({ ...props.structure, mailsPublic: mails });
    props.setHasModifications(true);
  };

  const onPrecisionsChange = (e: any) => {
    props.setHasModifications(true);
    return props.setStructure({
      ...props.structure,
      openingHours: {
        ...props.structure?.openingHours,
        precisions: e.target.value,
      },
    });
  };

  const getUpdatedPhones = (phones: string[], index: number) =>
    phones.filter((phone) => phone !== phones[index]);

  const getUpdatedMails = (mails: string[], index: number) =>
    mails.filter((mail) => mail !== mails[index]);

  const removePhone = (index: number) => {
    const updatedPhones =
      props.structure && props.structure.phonesPublic
        ? getUpdatedPhones(props.structure.phonesPublic, index)
        : [];
    props.setStructure({ ...props.structure, phonesPublic: updatedPhones });
    setshow1PhoneInput(false);
    setshow2PhoneInput(false);
    props.setHasModifications(true);
  };

  const removeMail = (index: number) => {
    const updatedMails =
      props.structure && props.structure.mailsPublic
        ? getUpdatedMails(props.structure.mailsPublic, index)
        : [];
    props.setStructure({ ...props.structure, mailsPublic: updatedMails });
    setshow1MailInput(false);
    setshow2MailInput(false);
    props.setHasModifications(true);
  };

  const isFranceSelected =
    !!props.structure &&
    !!props.structure.departments &&
    props.structure.departments[0] === "All";

  const phones =
    props.structure && props.structure.phonesPublic
      ? props.structure.phonesPublic
      : [];

  const mails =
    props.structure && props.structure.mailsPublic
      ? props.structure.mailsPublic
      : [];
  const noPublicChecked =
    !!props.structure &&
    !!props.structure.openingHours &&
    props.structure.openingHours.noPublic;

  const onlyWithRdv = !!props.structure && !!props.structure.onlyWithRdv;

  const getNewDetailedOpeningHours = (day: string) => {
    props.setHasModifications(true);

    if (!props.structure) return [];
    if (!props.structure.openingHours) return [{ day }];

    if (props.structure.openingHours.noPublic) return [];

    if (!props.structure.openingHours.details) return [{ day }];

    const isDayInOpeningHours =
      props.structure.openingHours.details.filter(
        (element: DetailedOpeningHours) => element.day === day
      ).length > 0;

    if (isDayInOpeningHours)
      return props.structure.openingHours.details.filter(
        (element: DetailedOpeningHours) => element.day !== day
      );

    return props.structure.openingHours.details.concat([{ day }]);
  };
  const onDayClick = (day: string) => {
    const newDetailedOpeningHours = getNewDetailedOpeningHours(day);
    const newOpeningHours = props.structure
      ? { ...props.structure.openingHours, details: newDetailedOpeningHours }
      : { noPublic: false, details: [] };
    props.setStructure({ ...props.structure, openingHours: newOpeningHours });
    props.setHasModifications(true);
  };

  const onHoursChange = (value: any, index: string, day: string) => {
    if (!props.structure) return;
    if (
      props.structure &&
      props.structure.openingHours &&
      props.structure.openingHours.noPublic
    )
      return;

    const dayRegistered =
      props.structure.openingHours && props.structure.openingHours.details
        ? props.structure.openingHours.details.filter(
            (element) => element.day === day
          )
        : [];

    if (dayRegistered) {
      const updatedDay = {
        ...dayRegistered[0],
        [index]: value.format("HH:mm"),
      };
      const openingHoursWithoutDayRegistered =
        props.structure.openingHours && props.structure.openingHours.details
          ? props.structure.openingHours.details.filter(
              (element) => element.day !== day
            )
          : [];
      const openingHours = props.structure.openingHours
        ? {
            ...props.structure.openingHours,
            details: openingHoursWithoutDayRegistered.concat([updatedDay]),
          }
        : { noPublic: false, details: [] };
      props.setStructure({
        ...props.structure,
        openingHours,
      });
    }
    props.setHasModifications(true);
  };

  return (
    <MainContainer>
      <Title>Départements d&apos;action</Title>
      {showHelp && (
        <HelpContainer>
          <IconContainer onClick={() => setShowHelp(false)}>
            <EVAIcon name="close" />
          </IconContainer>
          <HelpDescription>
            Si votre structure est présente sur plus de 8 départements, cochez
            le choix <b>France entière</b> puis créez une structure pour chacune
            de vos antennes territoriales.
          </HelpDescription>
        </HelpContainer>
      )}
      {!isFranceSelected && (
        <DepartmentContainer>
          {props.structure &&
            props.structure.departments &&
            props.structure.departments.length > 0 &&
            props.structure.departments.map((department) => (
              <SelectedContainer key={department}>
                {department}
                <div style={{ cursor: "pointer" }}>
                  <EVAIcon
                    name="close"
                    fill={"#ffffff"}
                    className="ml-10"
                    onClick={() => removeDropdowElement(department)}
                  />
                </div>
              </SelectedContainer>
            ))}
          {props.structure &&
            props.structure.departments &&
            props.structure.departments.length < 8 && (
              <div style={{ width: "280px", marginRight: "8px" }}>
              <FInput
                id="department"
                  value={departmentInput}
                  onChange={onDepartmentChange}
                  newSize={true}
                  placeholder="Entrez un numéro de département"
                  type="number"
                  prepend
                  prependName="hash"
                  autoFocus={false}
                />
                <CustomDropDown
                  elementList={departments}
                  onDropdownElementClick={onDropdownElementClick}
                />
              </div>
            )}
        </DepartmentContainer>
      )}
      <CheckboxContainer
        onClick={handleCheckboxChange}
        checked={isFranceSelected}
      >
        <CustomCheckBox checked={isFranceSelected} />
        France entière
      </CheckboxContainer>
      <Title>Adresse email</Title>
      <div style={{ marginBottom: "16px" }}>
        {(mails.length > 0 || show1MailInput) && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  width: "300px",
                  marginRight: "4px",
                }}
              >
                <FInput
                  id="mail0"
                  value={mails && mails[0]}
                  onChange={onMailChange}
                  newSize={true}
                  placeholder="Votre adresse email"
                  autoFocus={false}
                />
              </div>
              <DeleteIconContainer onClick={() => removeMail(0)}>
                <EVAIcon size="medium" name="close-outline" fill={"#ffffff"} />
              </DeleteIconContainer>
            </div>
            {mails.length < 2 && !show2MailInput && (
              <AddButton
                type="second email"
                onClick={toggle2MailInput}
                disabled={!mails[0]}
              />
            )}
          </>
        )}
        {(mails.length === 2 || show2MailInput) && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div style={{ width: "300px", marginRight: "4px" }}>
              <FInput
                type="text"
                id="mail1"
                value={mails && mails[1]}
                onChange={onMailChange}
                newSize={true}
                placeholder="Votre adresse email"
                autoFocus={false}
              />
            </div>
            <DeleteIconContainer onClick={() => removeMail(1)}>
              <EVAIcon size="medium" name="close-outline" fill={"#ffffff"} />
            </DeleteIconContainer>
          </div>
        )}
        {mails.length === 0 && !show1MailInput && (
          <AddButton type="email" onClick={toggle1MailInput} />
        )}
      </div>
      <Title>Numéro de télephone</Title>
      <div style={{ marginBottom: "16px" }}>
        {(phones.length > 0 || show1PhoneInput) && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  width: "130px",
                  marginRight: "4px",
                }}
              >
                <FInput
                  id="phone0"
                  value={phones && phones[0]}
                  onChange={onPhoneChange}
                  newSize={true}
                  placeholder="Votre numéro de téléphone"
                  type="number"
                  autoFocus={false}
                />
              </div>
              <DeleteIconContainer onClick={() => removePhone(0)}>
                <EVAIcon size="medium" name="close-outline" fill={"#ffffff"} />
              </DeleteIconContainer>
            </div>
            {phones.length < 2 && !show2PhoneInput && (
              <AddButton
                type="second numéro"
                onClick={toggle2PhoneInput}
                disabled={!phones[0]}
              />
            )}
          </>
        )}
        {(phones.length === 2 || show2PhoneInput) && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div style={{ width: "130px", marginRight: "4px" }}>
              <FInput
                type="number"
                id="phone1"
                value={phones && phones[1]}
                onChange={onPhoneChange}
                newSize={true}
                placeholder="Votre numéro de téléphone"
                autoFocus={false}
              />
            </div>
            <DeleteIconContainer onClick={() => removePhone(1)}>
              <EVAIcon size="medium" name="close-outline" fill={"#ffffff"} />
            </DeleteIconContainer>
          </div>
        )}
        {phones.length === 0 && !show1PhoneInput && (
          <AddButton type="numéro" onClick={toggle1PhoneInput} />
        )}
      </div>
      <Title>Adresse postale</Title>
      <div
        style={{
          marginBottom: "16px",
          width: "640px",
        }}
      >
        <FInput
          id="adressPublic"
          value={props?.structure?.adressPublic || undefined}
          onChange={onChange}
          newSize={true}
          placeholder="Entrez votre adresse"
          prepend
          prependName="pin-outline"
          autoFocus={false}
        />
      </div>
      <Title>Horaires d&apos;accueil du public</Title>
      <CheckboxContainer
        onClick={handlePublicCheckboxChange}
        checked={noPublicChecked}
      >
        <CustomCheckBox checked={noPublicChecked} />
        Notre structure n&apos;accueille pas de public.
      </CheckboxContainer>
      <CheckboxContainer
        onClick={handleRdvCheckboxChange}
        checked={onlyWithRdv}
      >
        <CustomCheckBox checked={onlyWithRdv} />
        Uniquement sur rendez-vous.
      </CheckboxContainer>

      {!noPublicChecked && (
        <>
          <Subtitle>Cochez ou décochez les jours d&apos;ouverture :</Subtitle>
          {days.map((day) => (
            <HoursDetails
              key={day}
              day={day}
              onClick={onDayClick}
              // @ts-ignore : it is not a string since noPublicChecked is false
              openingHours={props.structure ? props.structure.openingHours : []}
              onChange={onHoursChange}
            />
          ))}
        </>
      )}
      <div
        style={{
          marginTop: "16px",
          width: "640px",
          marginBottom: "32px",
        }}
      >
        <Input
          type="textarea"
          placeholder="Ajoutez ici des précisions si besoin (jours fériés, sur rendez-vous, etc.)"
          rows={5}
          value={
            (props.structure &&
              props.structure.openingHours &&
              props.structure.openingHours.precisions) ||
            ""
          }
          onChange={onPrecisionsChange}
        />
      </div>
    </MainContainer>
  );
};

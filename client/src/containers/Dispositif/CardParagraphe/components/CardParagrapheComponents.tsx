import React, { useState } from "react";
import {
  Tooltip,
  Input,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { DispositifContent } from "../../../../types/interface";
import { jsUcfirstInfocards } from "./functions";
import styled from "styled-components";
import FButton from "../../../../components/FigmaUI/FButton/FButton";

export const GeolocTooltipItem = (props: any) => {
  const { item, id } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <button
        key={id + "d"}
        id={"Tooltip-" + id}
        className={"backgroundColor-darkColor active "}
      >
        {item.split(" ")[0].length > 1
          ? item.split(" ")[0]
          : "0" + item.split(" ")[0]}
      </button>
      <Tooltip
        placement="top"
        offset="0px, 8px"
        isOpen={tooltipOpen}
        target={"Tooltip-" + id}
        toggle={toggle}
      >
        {item}
      </Tooltip>
    </>
  );
};

interface AgeRequisEditionContentTitleProps {
  subitem: DispositifContent;
  changeAge: (arg1: any, arg2: any, arg3: any, arg4: any) => void;
  keyValue: number;
  subkey: number;
}

export const AgeRequisEditionContentTitle = (
  props: AgeRequisEditionContentTitleProps // case Age Requis
) => {
  const title = props.subitem.contentTitle || props.subitem.ageTitle;

  return (
    <span>
      {title &&
        title.split("**").map((x, i, arr) => (
          <React.Fragment key={i}>
            <span>{x}</span>
            {i < arr.length - 1 && (
              <Input
                type="number"
                className="color-darkColor age-input"
                value={
                  (arr[0] === "De " && i === 0) || arr[0] === "Plus de "
                    ? props.subitem.bottomValue
                    : props.subitem.topValue
                }
                onClick={(e: { stopPropagation: () => void }) =>
                  e.stopPropagation()
                }
                onMouseUp={() =>
                  (props.subitem || {}).isFakeContent &&
                  props.changeAge(
                    { target: { value: "" } },
                    props.keyValue,
                    props.subkey,
                    i === 0 || arr[0] === "Plus de"
                  )
                }
                onChange={(e) =>
                  props.changeAge(
                    e,
                    props.keyValue,
                    props.subkey,
                    (arr[0] === "De " && i === 0) || arr[0] === "Plus de "
                  )
                }
              />
            )}
          </React.Fragment>
        ))}
    </span>
  );
};

interface DropDownContentProps {
  isOptionsOpen: boolean;
  toggleOptions: (e: any) => void;
  disableEdit: boolean;
  subitem: DispositifContent;
  changeAge: (arg1: any, arg2: any, arg3: any, arg4: any) => void;
  keyValue: number;
  subkey: number;
  t: any;
  cardTitle: { title: string; options: string[] };
}
export const DropDownContent = (props: DropDownContentProps) => (
  <ButtonDropdown
    isOpen={props.isOptionsOpen}
    toggle={props.toggleOptions}
    className="content-title"
  >
    <DropdownToggle caret={!props.disableEdit}>
      {props.subitem.title === "Âge requis" ? (
        <AgeRequisEditionContentTitle
          subitem={props.subitem}
          keyValue={props.keyValue}
          subkey={props.subkey}
          changeAge={props.changeAge}
        />
      ) : (
        <span>
          {props.subitem.contentTitle &&
            jsUcfirstInfocards(
              props.t(
                "Dispositif." + props.subitem.contentTitle,
                props.subitem.contentTitle
              ),
              props.cardTitle.title
            )}
        </span>
      )}
    </DropdownToggle>
    <DropdownMenu>
      {props.cardTitle.options.map((option, key: number) => {
        return (
          //@ts-ignore
          <DropdownItem key={key} id={key}>
            {props.cardTitle
              ? jsUcfirstInfocards(option, props.cardTitle.title)
              : ""}
          </DropdownItem>
        );
      })}
    </DropdownMenu>
  </ButtonDropdown>
);

interface FrenchCECRLevelProps {
  subitem: DispositifContent;
}
const niveaux = ["A1.1", "A1", "A2", "B1", "B2", "C1", "C2"];

export const FrenchCECRLevel = (props: FrenchCECRLevelProps) => (
  <div className="color-darkColor niveaux-wrapper">
    {niveaux
      .filter((nv) =>
        (props.subitem.niveaux || []).some((x: string) => x === nv)
      )
      .map((nv, key) => (
        <button key={key} className={"backgroundColor-darkColor active"}>
          {nv}
        </button>
      ))}
  </div>
);

interface DepartmentsSelectedProps {
  subitem: DispositifContent;
  disableEdit: boolean;
}

const TitleTextBody = styled.p`
  font-size: 22px;
  line-height: 20px;
  margin: 0;
  padding-bottom: 12px;
  padding-top: 10px;
  font-weight: 600;
  margin-top: ${(props) => props.mt || 0};
`;

export const DepartmentsSelected = (props: DepartmentsSelectedProps) => (
  <div className="color-darkColor niveaux-wrapper">
    {props.subitem.departments && props.subitem.departments.length > 1 ? (
      props.subitem.departments.map((nv, key) => (
        <GeolocTooltipItem key={key} item={nv} id={key} />
      ))
    ) : props.subitem.departments &&
      props.subitem.departments.length === 1 &&
      (!props.disableEdit || props.subitem.departments[0] !== "All") ? (
      <TitleTextBody mt={"8px"}>
        {props.subitem.departments[0] === "All"
          ? "France entière"
          : props.subitem.departments[0]}
      </TitleTextBody>
    ) : null}
  </div>
);

interface AdminGeolocPublicationButtonProps {
  admin: boolean;
  subitem: DispositifContent;
  dispositifId: string;
  disableEdit: boolean;
  onValidateGeoloc: (arg: string, arg1: DispositifContent) => void;
}

const ButtonText = styled.p`
  font-size: 16px;
  line-height: 20px;
  margin: 0;
`;
export const AdminGeolocPublicationButton = (
  props: AdminGeolocPublicationButtonProps
) => {
  if (
    props.admin &&
    props.subitem.title === "Zone d'action" &&
    props.subitem.departments &&
    props.dispositifId !== "" &&
    !props.disableEdit
  )
    return (
      <FButton
        type="validate"
        name="checkmark"
        className={"mt-10"}
        onClick={() =>
          props.onValidateGeoloc(props.dispositifId, props.subitem)
        }
        disabled={props.subitem.departments.length === 0}
      >
        <ButtonText>Publier Geoloc</ButtonText>
      </FButton>
    );

  return <div></div>;
};

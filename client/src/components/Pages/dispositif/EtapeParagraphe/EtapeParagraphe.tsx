import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Collapse,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  Input,
  DropdownItem,
  Form,
  Label,
  FormGroup,
  Tooltip,
} from "reactstrap";
import ContentEditable from "react-contenteditable";
import _ from "lodash";
import { useTranslation } from "next-i18next";

import FButton from "components/UI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import QuickToolbar from "../QuickToolbar";
import EditableParagraph from "components/Frontend/Dispositif/EditableParagraph/EditableParagraph";
import FInput from "components/UI/FInput/FInput";

import { colors } from "colors";
import { EtapeModal } from "components/Modals";
import styled from "styled-components";
import styles from "./EtapeParagraphe.module.scss";
import { DispositifContent, Tag} from "types/interface";
import { demarcheSteps, ShortContent } from "data/dispositif";
import { EditorState } from "draft-js";
import { UiElement, UiElementNodes } from "services/SelectedDispositif/selectedDispositif.reducer";
import useRTL from "hooks/useRTL";
import { cls } from "lib/classname";
import mobile from "scss/components/mobile.module.scss";

interface AccordeonProps {
  newDisableEdit: boolean
  subkey: number
  isAccordeonOpen: boolean
  darkColor: string
  lightColor: string
}
const StyledAccordeon = styled.div`
  padding: ${(props: AccordeonProps) =>
    props.newDisableEdit || props.subkey === 0
      ? "16px"
      : "16px 62px 16px 16px"};

  border: ${(props: AccordeonProps) =>
    props.newDisableEdit && props.isAccordeonOpen
      ? `solid 2px ${props.darkColor}`
      : "none"};
  background: ${(props: AccordeonProps) =>
    props.newDisableEdit && props.isAccordeonOpen
      ? props.lightColor
      : "#f2f2f2"};
  border-radius: 12px;
  outline: none;
  boxshadow: none;
  cursor: pointer;
  display: flex;
  position: relative;
  flex-direction: row;
  box-shadow: ${(props: AccordeonProps) =>
    props.newDisableEdit && !props.isAccordeonOpen
      ? "0px 10px 15px rgba(0, 0, 0, 0.25)"
      : "none"};
`;

const StyledHeader = styled.div`
  display: flex;
  margin: auto;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: ${(props: {darkColor: string}) => props.darkColor};
  align-items: center;
`;
interface StepProps {
  isRTL: boolean
  darkColor: string
}
const StyledStep = styled.div`
  background: ${(props: StepProps) => props.darkColor};
  border-radius: 50%;
  color: white;
  height: 36px;
  min-width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${(props: StepProps) => (props.isRTL ? "0px" : "16px")};
  margin-left: ${(props: StepProps) => (props.isRTL ? "16px" : "0px")};
`;

interface Props {
  keyValue: number;
  subkey: number;
  item: DispositifContent;
  subitem: any; // DispositifContent; using old props
  updateUIArray: (
    key: number,
    arg: number | null,
    variante: UiElementNodes,
    option?: boolean
  ) => void;
  handleContentClick: (key: number, editable: boolean, subkey?: number | undefined) => void;
  handleMenuChange: (ev: any, value?: any) => any
  onEditorStateChange: (editorState: EditorState, key: number, subkey?: number | null) => void;
  addItem: (key: any, type?: string, subkey?: string | number | null) => void;
  toggleModal: (show: boolean, name: string) => void
  removeItem: any;
  mainTag: Tag;
  typeContenu: "dispositif" | "demarche";
  uiArray: UiElement[];
  disableEdit: boolean;
  upcoming: () => void;
  content: ShortContent;
}

const EtapeParagraphe = (props: Props) => {
  const [options, setOptions] = useState(
    demarcheSteps.options.map((x) => ({ ...x, selected: false }))
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean[]>(
    new Array(2).fill(false)
  );
  const [isPapiersDropdownOpen, setIsPapiersDropdownOpen] = useState<boolean[]>(
    [false]
  );
  const [validatedRow, setValidatedRow] = useState<boolean[]>(
    new Array(4).fill(false)
  );
  const [checked, setChecked] = useState(false);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [value3, setValue3] = useState("");
  const [value4, setValue4] = useState("");
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>({});
  const [configurationOpen, setConfigurationOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState<boolean[]>(
    new Array(4).fill(false)
  );
  const [showModal, setShowModal] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (
      (!isOptionSelected && props.subitem.option?.value1,
      props.subitem.option?.value2,
      props.subitem.option?.checked !== undefined)
    ) {
      const { checked, value1, value2, value3, value4, texte } = props.subitem.option;
      const subItemPapiers = props.subitem?.papiers || [];
      const isPapiersDropdownOpen =
        subItemPapiers.length > 0
          ? new Array(subItemPapiers.length).fill(false)
          : [false];
      setChecked(checked);
      setValue1(value1);
      setValue2(value2);
      setValue3(value3);
      setValue4(value4);
      setIsPapiersDropdownOpen(isPapiersDropdownOpen);
      setIsOptionSelected(true);
      setSelectedOption(props.subitem.option);
      setOptions(options.map((x) => ({ ...x, selected: x.texte === texte })));
    }
    if ((props.subitem?.papiers || []).length > 0) {
      setIsPapiersDropdownOpen(
        new Array((props.subitem.papiers || []).length + 1).fill(false)
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.subitem.option?.value1,
    props.subitem.option?.value2,
    props.subitem.option?.checked,
  ]);

  const toggleModal = () => setShowModal(!showModal);

  const setPropsValue = (value: any, target: string) => {
    props.handleMenuChange(
      {
        currentTarget: {
          id: props.keyValue.toString(),
          dataset: {
            subkey: props.subkey.toString(),
            target: target,
          },
        },
      },
      value
    );
    setValidatedRow(
      validatedRow.map((x, i) =>
        (target === "duree" && i === 1) ||
        (target === "delai" && i === 2) ||
        (target === "papiers" && i === 3)
          ? i !== 3 || value.length > 0
          : x
      )
    );
  };

  const toggleDropdown = (idx: number) =>
    setIsDropdownOpen(isDropdownOpen.map((x, i) => (i === idx ? !x : x)));

  const togglePapiersDropdown = (idx: number) =>
    setIsPapiersDropdownOpen(
      isPapiersDropdownOpen.map((x, i) => (i === idx ? !x : x))
    );

  const handleCheck = () => {
    if (!checked) setValue1("");
    setChecked(!checked);
  };

  const toggleConfigurationOpen = () =>
    setConfigurationOpen(!configurationOpen);

  const selectOption = (idx: number | null = null, option = {}) => {
    setIsOptionSelected(idx !== null);
    setSelectedOption(option);
    setOptions(options.map((x, i: number) => ({ ...x, selected: i === idx })));
    setValue1("");
    setValue2("");
    setValue3("");
    setValue4("");
    setChecked(false);
  };

  const toggleTooltip = (idx: number) =>
    setTooltipOpen(tooltipOpen.map((x, i) => (i === idx ? !x : x)));

  const validateOption = (e: any) => {
    e.preventDefault();
    setValidatedRow(validatedRow.map((x, i) => (i === 0 ? true : x)));
    setIsOptionSelected(false);
  };

  const addDoc = (papier: any, idx: number|null = null, add = true) => {
    const newPapiers =
      idx === null
        ? [...(props.subitem.papiers || []), papier]
        : add
        ? props.subitem.papiers.map((x: any, i: number) => (i === idx ? papier : x))
        : props.subitem.papiers.filter((_: any, i: number) => i !== idx);

    setPropsValue(newPapiers, "papiers");
    setIsPapiersDropdownOpen([...isPapiersDropdownOpen, false]);
  };

  const setOption = () => {
    const newOption = {
      ...selectedOption,
      checked,
      value1,
      value2,
      value3,
      value4,
      ctaText: selectedOption.ctaField
        ? selectedOption[selectedOption.ctaField]
        : selectedOption.ctaText,
    };
    setPropsValue(newOption, "option");
  };

  const {
    keyValue,
    subitem,
    subkey,
    uiArray,
    updateUIArray,
    disableEdit,
  } = props;

  const safeUiArray = (key: number, subkey: number, node: string) => {
    const children = props.uiArray[key].children;
    if (children === undefined) return false;
    return props.uiArray[key] &&
    children &&
    children.length > subkey &&
    children[subkey] &&
    //@ts-ignore
    children[subkey][node];
  }

  const isAccordeonOpen = !!safeUiArray(keyValue, subkey, "accordion");
  const darkColor = props.mainTag?.darkColor || colors.gray90;
  const lightColor = props.mainTag?.lightColor || colors.gray20;
  const isRTL = useRTL();

  return (
    <div
      key={subkey}
      className={
        styles.etape +
        " contenu " +
        (safeUiArray(keyValue, subkey, "isHover") ? " isHovered" : "")
      }
      onMouseEnter={(e) => updateUIArray(keyValue, subkey, "isHover", true)}
    >
      <Row className="relative-position">
        <Col lg="12" md="12" sm="12" xs="12" className="accordeon-col">
          <div className="title-bloc">
            <StyledAccordeon
              isAccordeonOpen={isAccordeonOpen}
              newDisableEdit={disableEdit}
              lightColor={lightColor}
              darkColor={darkColor}
              subkey={subkey}
              onMouseUp={() =>
                disableEdit &&
                updateUIArray(
                  keyValue,
                  subkey,
                  "accordion",
                  !safeUiArray(keyValue, subkey, "accordion")
                )
              }
              aria-expanded={safeUiArray(keyValue, subkey, "accordion")}
              aria-controls={"collapse" + keyValue + "-" + subkey}
            >
              <StyledHeader darkColor={darkColor}>
                <StyledStep darkColor={darkColor} isRTL={isRTL}>
                  {subkey + 1}{" "}
                </StyledStep>
                <ContentEditable
                  id={keyValue.toString()}
                  data-subkey={subkey}
                  data-target="title"
                  className={styles.etape_title}
                  html={subitem.title || ""} // innerHTML of the editable div
                  disabled={disableEdit} // use true to disable editing
                  onChange={props.handleMenuChange} // handle innerHTML change
                  onMouseUp={(e) => !disableEdit && e.stopPropagation()}
                  placeholder="Le titre de cette étape est vide"
                />
                {disableEdit && (
                  <EVAIcon
                    name={
                      "chevron-" +
                      (safeUiArray(keyValue, subkey, "accordion")
                        ? "up"
                        : "down") +
                      "-outline"
                    }
                    size="large"
                    fill={darkColor}
                    className="ml-8"
                  />
                )}
              </StyledHeader>
              {!disableEdit && subkey > 0 && (
                <EVAIcon
                  onClick={() => props.removeItem(keyValue, subkey)}
                  className={styles.delete_icon}
                  name="close-circle"
                  fill={colors.error}
                  size="xlarge"
                />
              )}
            </StyledAccordeon>
            <div
              className={
                styles.etapes_data +
                " ml-10 " +
                (disableEdit ? "" : styles.editing)
              }
              onClick={toggleConfigurationOpen}
            >
              {subitem.option && subitem.option.texte && (
                <div className={styles.etape_data} id="etape-option">
                  <EVAIcon
                    name={((subitem.option || {}).logo || "at") + "-outline"}
                    fill={colors.gray70}
                    className="mr-8"
                  />
                  <span>
                    {t(
                      "Dispositif." +
                        ((subitem.option || {}).texte || "En ligne"),
                      (subitem.option || {}).texte || "En ligne"
                    )}
                  </span>
                  <Tooltip
                    placement="top"
                    offset="0px, 8px"
                    isOpen={tooltipOpen[0]}
                    target="etape-option"
                    toggle={() => toggleTooltip(0)}
                  >
                    {t("Dispositif.Type de démarche", "Type de démarche")}
                  </Tooltip>
                </div>
              )}
              {subitem.duree && subitem.duree !== "00" && (
                <div className={styles.etape_data} id="etape-duree">
                  <EVAIcon
                    name="clock-outline"
                    fill={colors.gray70}
                    className="mr-8"
                  />
                  <span>
                    {subitem.duree || 0}{" "}
                    {t(subitem.timeStepDuree, subitem.timeStepDuree)}
                  </span>
                  <Tooltip
                    placement="top"
                    offset="0px, 8px"
                    isOpen={tooltipOpen[1]}
                    target="etape-duree"
                    toggle={() => toggleTooltip(1)}
                  >
                    {t(
                      "Dispositif.Combien de temps",
                      "Combien de temps ça va vous prendre ?"
                    )}
                  </Tooltip>
                </div>
              )}
              {subitem.delai && subitem.delai !== "00" && (
                <div className={styles.etape_data} id="etape-delai">
                  <EVAIcon
                    name="undo"
                    fill={colors.gray70}
                    className="mr-8"
                  />
                  <span>
                    {subitem.delai &&
                    subitem.delai !== "00" &&
                    subitem.timeStepDelai ? (
                      <span>
                        {subitem.delai}{" "}
                        {t(subitem.timeStepDelai, subitem.timeStepDelai)}
                      </span>
                    ) : (
                      t("Dispositif.Immédiate", "Immédiate")
                    )}
                  </span>
                  <Tooltip
                    placement="top"
                    offset="0px, 8px"
                    isOpen={tooltipOpen[2]}
                    target="etape-delai"
                    toggle={() => toggleTooltip(2)}
                  >
                    {t(
                      "Dispositif.Délais de réponse annoncés",
                      "Délais de réponse annoncés"
                    )}
                  </Tooltip>
                </div>
              )}
              {subitem.papiers && subitem.papiers.length > 0 && (
                <div className={styles.etape_data} id="etape-papiers">
                  <EVAIcon
                    name="file-text-outline"
                    fill={colors.gray70}
                    className="mr-8"
                  />
                  <span>{(subitem.papiers || []).length || 0}</span>
                  <Tooltip
                    placement="top"
                    offset="0px, 8px"
                    isOpen={tooltipOpen[3]}
                    target="etape-papiers"
                    toggle={() => toggleTooltip(3)}
                  >
                    {t(
                      "Dispositif.Documents nécessaires",
                      "Documents nécessaires"
                    )}
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          <Collapse
            className={styles.bloc_configuration}
            isOpen={!disableEdit && configurationOpen}
            data-parent=".etapes_data"
          >
            <h5>Configurez votre étape</h5>

            <div
              className={
                styles.row_config +
                " " +
                styles.direction_colonne +
                "  mb-10 " +
                (validatedRow[0] ? styles.validated : "")
              }
            >
              <div className={styles.options_wrapper}>
                {options.map((option, key: number) => (
                  <div
                    className={
                      styles.col_config +
                      " mr-10 " +
                      (option.selected ? styles.active : "")
                    }
                    key={key}
                    onClick={() => selectOption(key, option)}
                  >
                    <EVAIcon
                      name={option.logo + "-outline"}
                      fill={colors.gray90}
                      className="mr-10"
                    />
                    <span>{option.texte}</span>
                  </div>
                ))}
              </div>
              {isOptionSelected && (
                <Form onSubmit={validateOption} className="mt-10 full-width">
                  <FormGroup>
                    <Label
                      for="link"
                      lg={
                        selectedOption.label1
                          ? selectedOption.texte === "Autre"
                            ? "9"
                            : "3"
                          : "0"
                      }
                    >
                      {selectedOption.label1}
                    </Label>
                    <Col
                      lg={
                        selectedOption.label1
                          ? selectedOption.texte === "Autre"
                            ? "3"
                            : "9"
                          : "12"
                      }
                    >
                      <FInput
                        prepend={!!selectedOption.icon1}
                        prependName={selectedOption.icon1 + "-outline"}
                        value={value1}
                        disabled={checked}
                        onChange={(e: any) => setValue1(e.target.value)}
                        id="link"
                        type="text"
                        placeholder={selectedOption.placeholder1}
                      />
                    </Col>
                  </FormGroup>
                  {selectedOption.placeholder2 && (
                    <FormGroup>
                      <Label
                        for="displayText"
                        lg={selectedOption.label2 ? "3" : "0"}
                      >
                        {selectedOption.label2}
                      </Label>
                      <Col
                        lg={
                          selectedOption.label2
                            ? "9"
                            : selectedOption.placeholder3
                            ? "3"
                            : "12"
                        }
                      >
                        <FInput
                          prepend={!!selectedOption.icon2}
                          prependName={selectedOption.icon2 + "-outline"}
                          value={value2}
                          onChange={(e: any) => setValue2(e.target.value)}
                          id="displayText"
                          type={selectedOption.icon2 ? "text" : "textarea"}
                          placeholder={selectedOption.placeholder2}
                        />
                      </Col>
                      {selectedOption.placeholder3 && (
                        <>
                          <Col lg="6">
                            <FInput
                              prepend
                              prependName={selectedOption.icon3 + "-outline"}
                              value={value3}
                              onChange={(e: any) => setValue3(e.target.value)}
                              id="displayText"
                              type="text"
                              placeholder={selectedOption.placeholder3}
                            />
                          </Col>
                          <Col lg="3">
                            <FInput
                              prepend
                              prependName={selectedOption.icon4 + "-outline"}
                              value={value4}
                              onChange={(e: any) => setValue4(e.target.value)}
                              id="displayText"
                              type="text"
                              placeholder={selectedOption.placeholder4}
                            />
                          </Col>
                        </>
                      )}
                    </FormGroup>
                  )}
                  <div className={styles.footer_form}>
                    {selectedOption.checkbox ? (
                      <FormGroup
                        check
                        className={styles.no_info + (checked ? " checked" : "")}
                      >
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={checked}
                            onChange={handleCheck}
                          />{" "}
                          <span>{selectedOption.checkbox}</span>
                        </Label>
                      </FormGroup>
                    ) : (
                      <div />
                    )}
                    <div className={styles.footer_btns}>
                      <FButton
                        type="light-action"
                        name="close-outline"
                        className="mr-10"
                        onClick={() => selectOption()}
                      >
                        Annuler
                      </FButton>
                      <FButton
                        type="validate"
                        name="checkmark-outline"
                        onClick={setOption}
                        disabled={
                          !checked &&
                          (!value1 || (selectedOption.placeholder2 && !value2))
                        }
                      >
                        Valider
                      </FButton>
                    </div>
                  </div>
                </Form>
              )}
            </div>

            <div
              className={
                styles.row_config +
                " mb-10 " +
                (validatedRow[1] ? styles.validated : "")
              }
            >
              <EVAIcon
                name="clock-outline"
                fill={colors.gray90}
                className="mr-10"
              />
              <b>Cette étape prend :</b>

              <Input
                type="number"
                className={styles.etape_input + " mr-10"}
                placeholder="00"
                id={keyValue.toString()}
                data-subkey={subkey}
                data-target="duree"
                value={subitem.duree}
                onChange={(e) => setPropsValue(e.target.value, "duree")}
              />

              <ButtonDropdown
                isOpen={isDropdownOpen[0]}
                toggle={() => toggleDropdown(0)}
                className={styles.etape_dropdown + " mr-10"}
              >
                <DropdownToggle caret>{subitem.timeStepDuree}</DropdownToggle>
                <DropdownMenu>
                  {demarcheSteps.timeSteps.map((timeStep, key) => (
                    <DropdownItem
                      key={key}
                      id={key.toString()}
                      onClick={() =>
                        setPropsValue(timeStep.texte, "timeStepDuree")
                      }
                    >
                      {timeStep.texte}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </ButtonDropdown>
              <span className="color-gray70">
                Précisez le temps nécessaire pour faire cette étape.
              </span>
            </div>

            <div
              className={
                styles.row_config +
                " mb-10 " +
                (validatedRow[2] ? styles.validated : "")
              }
            >
              <EVAIcon name="undo" fill={colors.gray90} className="mr-10" />
              <b>Délai de réponse :</b>

              <Input
                type="number"
                className={styles.etape_input + " mr-10"}
                placeholder="00"
                id={keyValue.toString()}
                data-subkey={subkey}
                data-target="delai"
                value={subitem.delai}
                onChange={(e) => setPropsValue(e.target.value, "delai")}
              />

              <ButtonDropdown
                isOpen={isDropdownOpen[1]}
                toggle={() => toggleDropdown(1)}
                className={styles.etape_dropdown + " mr-10"}
              >
                <DropdownToggle caret>{subitem.timeStepDelai}</DropdownToggle>
                <DropdownMenu>
                  {demarcheSteps.timeSteps.map((timeStep, key) => (
                    <DropdownItem
                      key={key}
                      id={key.toString()}
                      onClick={() =>
                        setPropsValue(timeStep.texte, "timeStepDelai")
                      }
                    >
                      {timeStep.texte}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </ButtonDropdown>

              <span className="color-gray70">
                Précisez le délai de réponse légal ou constaté.
              </span>
            </div>

            <div
              className={
                styles.row_config +
                " " +
                styles.negative_padding +
                " " +
                (validatedRow[3] ? styles.validated : "")
              }
            >
              <EVAIcon
                name="file-text"
                fill={colors.gray90}
                className="mr-10 mb-10"
              />
              <b className="mr-10 mb-10">
                Documents justificatifs{" "}
                {subitem.papiers &&
                  subitem.papiers.length > 0 &&
                  "(" + subitem.papiers.length + ") "}
                :
              </b>

              {(subitem.papiers || []).map((doc: any, idx: number) => (
                <ButtonDropdown
                  isOpen={isPapiersDropdownOpen[idx]}
                  toggle={() => togglePapiersDropdown(idx)}
                  className={styles.etape_dropdown + " mr-10"}
                  key={idx}
                >
                  <DropdownToggle caret className={styles.docs_dropdown}>
                    <span className={styles.idx_docs}>{idx + 1}</span>
                    {doc.texte}
                    {!disableEdit && (
                      <EVAIcon
                        onClick={(e: any) => {
                          e.stopPropagation();
                          addDoc(doc, idx, false);
                        }}
                        className={styles.delete_icon}
                        name="close-circle"
                        fill={colors.error}
                        size="xlarge"
                      />
                    )}
                  </DropdownToggle>
                  <DropdownMenu>
                    {demarcheSteps.papiers.map((papier, key) => (
                      <DropdownItem
                        key={key}
                        id={key.toString()}
                        onClick={() => addDoc(papier, idx)}
                      >
                        {key + 1 + " - " + papier.texte}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </ButtonDropdown>
              ))}
              <ButtonDropdown
                isOpen={isPapiersDropdownOpen[isPapiersDropdownOpen.length - 1]}
                toggle={() =>
                  togglePapiersDropdown(isPapiersDropdownOpen.length - 1)
                }
                className={styles.etape_dropdown + " mr-10"}
              >
                <DropdownToggle caret className={styles.docs_dropdown}>
                  <EVAIcon
                    name="plus-circle"
                    className={styles.plus_btn_docs}
                  />
                  Ajouter un document
                </DropdownToggle>
                <DropdownMenu>
                  {demarcheSteps.papiers.map((papier, key) => (
                    <DropdownItem
                      key={key}
                      id={key.toString()}
                      onClick={() => addDoc(papier)}
                    >
                      {key + 1 + " - " + papier.texte}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </ButtonDropdown>
            </div>

            <div className={styles.footer_btns + " mt-10"}>
              <FButton
                tag={"a"}
                href="https://help.refugies.info/fr/"
                target="_blank"
                rel="noopener noreferrer"
                type="help"
                name="question-mark-circle-outline"
                fill={colors.error}
              >
                {t("J'ai besoin d'aide")}
              </FButton>
              <FButton
                type="validate"
                name="checkmark-outline"
                onClick={toggleConfigurationOpen}
                fill={colors.gray90}
                disabled={!validatedRow.includes(true)}
              >
                Valider
              </FButton>
            </div>
          </Collapse>

          <Collapse
            className="contenu-accordeon etape-accordeon"
            isOpen={safeUiArray(keyValue, subkey, "accordion")}
            data-parent="#accordion"
            id={"collapse" + keyValue + "-" + subkey}
            aria-labelledby={"heading" + keyValue + "-" + subkey}
          >
            {subitem.option && subitem.option.ctaField && (
              <div className={styles.realisation_wrapper}>
                <div className={styles.real_btns}>
                  <FButton
                    type="dark"
                    name="link-outline"
                    className="mr-10"
                    fill={colors.gray90}
                    onClick={toggleModal}
                  >
                    {subitem.option.ctaField
                      ? subitem.option[subitem.option.ctaField]
                      : subitem.option.ctaText &&
                        t(
                          "Dispositif." + subitem.option.ctaText,
                          subitem.option.ctaText
                        )}
                  </FButton>
                  <FButton
                    type="help"
                    name="question-mark-circle-outline"
                    fill={colors.error}
                    onClick={props.upcoming}
                  >
                    {t("J'ai besoin d'aide")}
                  </FButton>
                </div>
              </div>
            )}
            <EditableParagraph
              keyValue={keyValue}
              subkey={subkey}
              target="content"
              handleMenuChange={props.handleMenuChange}
              onEditorStateChange={props.onEditorStateChange}
              handleContentClick={props.handleContentClick}
              disableEdit={disableEdit}
              addItem={props.addItem}
              type={subitem.type}
              content={subitem.content}
              editable={subitem.editable}
              placeholder={subitem.placeholder}
              //@ts-ignore
              editorState={subitem.editorState}
            />
          </Collapse>
          {!disableEdit && (
            <FButton
              type="dark"
              name="plus-circle-outline"
              className="mt-10"
              onClick={() => props.addItem(keyValue, "etape", subkey)}
            >
              Ajouter une étape
            </FButton>
          )}
        </Col>
        {disableEdit && (
          <Col lg="2" md="2" sm="2" xs="2" className={cls(mobile.hidden, "toolbar-col")}>
            <QuickToolbar
              show={safeUiArray(keyValue, subkey, "isHover")}
              keyValue={keyValue}
              subkey={subkey}
              item={props.item}
              handleContentClick={props.handleContentClick}
              disableEdit={props.disableEdit}
              removeItem={props.removeItem}
              toggleModal={props.toggleModal}
            />
          </Col>
        )}
      </Row>

      <EtapeModal
        show={showModal}
        toggle={toggleModal}
        subitem={props.subitem}
        upcoming={props.upcoming}
        content={props.content}
        subkey={props.subkey}
      />
    </div>
  );
};

export default EtapeParagraphe;

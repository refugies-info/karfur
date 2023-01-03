import React, { useState, useEffect } from "react";
import { Row, Col, Collapse } from "reactstrap";
import ContentEditable from "react-contenteditable";
import FButton from "components/UI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import QuickToolbar from "../QuickToolbar";
import EditableParagraph from "components/Frontend/Dispositif/EditableParagraph/EditableParagraph";
import { colors } from "colors";
import styled from "styled-components";
import styles from "./EtapeParagraphe.module.scss";
import { DispositifContent, Theme } from "types/interface";
import { ShortContent } from "data/dispositif";
import { EditorState } from "draft-js";
import { UiElement, UiElementNodes } from "services/SelectedDispositif/selectedDispositif.reducer";
import useRTL from "hooks/useRTL";
import { cls } from "lib/classname";
import mobile from "scss/components/mobile.module.scss";

interface AccordeonProps {
  newDisableEdit: boolean;
  subkey: number;
  isAccordeonOpen: boolean;
  darkColor: string;
  lightColor: string;
}
const StyledAccordeon = styled.div`
  padding: ${(props: AccordeonProps) => (props.newDisableEdit || props.subkey === 0 ? "16px" : "16px 62px 16px 16px")};

  border: ${(props: AccordeonProps) =>
    props.newDisableEdit && props.isAccordeonOpen ? `solid 2px ${props.darkColor}` : "none"};
  background: ${(props: AccordeonProps) =>
    props.newDisableEdit && props.isAccordeonOpen ? props.lightColor : "#f2f2f2"};
  border-radius: 12px;
  outline: none;
  boxshadow: none;
  cursor: pointer;
  display: flex;
  position: relative;
  flex-direction: row;
  box-shadow: ${(props: AccordeonProps) =>
    props.newDisableEdit && !props.isAccordeonOpen ? "0px 10px 15px rgba(0, 0, 0, 0.25)" : "none"};
`;

const StyledHeader = styled.div`
  display: flex;
  margin: auto;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: ${(props: { darkColor: string }) => props.darkColor};
  align-items: center;
`;
interface StepProps {
  isRTL: boolean;
  darkColor: string;
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
  updateUIArray: (key: number, arg: number | null, variante: UiElementNodes, option?: boolean) => void;
  handleContentClick: (key: number, editable: boolean, subkey?: number | undefined) => void;
  handleMenuChange: (ev: any, value?: any) => any;
  onEditorStateChange: (editorState: EditorState, key: number, subkey?: number | null) => void;
  addItem: (key: any, type?: string, subkey?: string | number | null) => void;
  toggleModal: (show: boolean, name: string) => void;
  removeItem: any;
  theme: Theme;
  typeContenu: "dispositif" | "demarche";
  uiArray: UiElement[];
  disableEdit: boolean;
  content: ShortContent;
  printing: boolean;
}

const EtapeParagraphe = (props: Props) => {
  const [openAccordions, setOpenAccordions] = useState(true); // open accordions for robots
  useEffect(() => {
    setOpenAccordions(false); // but close it for users
  }, []);

  const { keyValue, subitem, subkey, updateUIArray, disableEdit } = props;

  const safeUiArray = (key: number, subkey: number, node: string) => {
    const children = props.uiArray[key].children;
    if (children === undefined) return false;
    return (
      props.uiArray[key] &&
      children &&
      children.length > subkey &&
      children[subkey] &&
      //@ts-ignore
      children[subkey][node]
    );
  };

  const isAccordeonOpen = props.printing || openAccordions || !!safeUiArray(keyValue, subkey, "accordion");
  const darkColor = props.theme?.colors.color100 || colors.gray90;
  const lightColor = props.theme?.colors.color30 || colors.gray20;
  const isRTL = useRTL();

  return (
    <div
      key={subkey}
      className={styles.etape + " contenu " + (safeUiArray(keyValue, subkey, "isHover") ? " isHovered" : "")}
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
              onMouseUp={() => disableEdit && updateUIArray(keyValue, subkey, "accordion", !isAccordeonOpen)}
              aria-expanded={isAccordeonOpen}
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
                    name={`chevron-${isAccordeonOpen ? "up" : "down"}-outline`}
                    size="large"
                    fill={darkColor}
                    className="ms-2"
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
          </div>

          <Collapse
            className="contenu-accordeon etape-accordeon"
            isOpen={isAccordeonOpen}
            data-parent="#accordion"
            id={"collapse" + keyValue + "-" + subkey}
            aria-labelledby={"heading" + keyValue + "-" + subkey}
          >
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
              className="mt-2"
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
    </div>
  );
};

export default EtapeParagraphe;

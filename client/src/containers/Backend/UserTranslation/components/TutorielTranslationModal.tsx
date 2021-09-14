import _ from "lodash";
import React from "react";
import { Modal } from "reactstrap";
import { colors } from "../../../../colors";
import FButton from "../../../../components/FigmaUI/FButton/FButton";

interface Props {
  show: boolean;
  toggle: () => void;
}

export const TutorialTranslationModal = (props: Props) => {
  const defaultUrl =
    "https://help.refugies.info/fr/article/experts-traduire-les-besoins-pour-lapplication-mobile-1fpz5wg/reader/";

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className="modal-besoins"
      size="lg"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "40px",
          background: "#FBFBFB",
          filter: "drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.15))",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        <FButton
          href={defaultUrl}
          type="dark"
          name="external-link"
          fill={colors.noir}
          className="mr-10"
          target="_blank"
        >
          Voir dans le centre d'aide
        </FButton>
        <FButton
          type="tuto"
          name={"checkmark"}
          className="ml-10"
          onClick={props.toggle}
        >
          Compris !
        </FButton>
      </div>
      <iframe
        style={{
          alignSelf: "center",
          width: "100%",
          height: 500,
          border: "1px solid #FBFBFB",
          borderRadius: "0px 0px 12px 12px",
        }}
        allowFullScreen
        src={defaultUrl + "/reader/"}
      />
    </Modal>
  );
};

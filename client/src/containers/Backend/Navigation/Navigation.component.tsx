import FButton from "../../../components/FigmaUI/FButton/FButton";
import React from "react";
import { withRouter } from "react-router-dom";

interface Props {
  history: any;
}
const NavigationComponent: React.FunctionComponent<Props> = (props: Props) => {
  const onNavigateToTraductions = () => {
    props.history.push("/backend/user-translation");
  };
  return (
    <div>
      <FButton type="dark" onClick={onNavigateToTraductions}>
        Traduction
      </FButton>
    </div>
  );
};

export const Navigation = withRouter(NavigationComponent);

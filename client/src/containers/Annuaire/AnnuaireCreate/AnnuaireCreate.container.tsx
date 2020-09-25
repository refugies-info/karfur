import { connect } from "react-redux";
import { compose } from "recompose";
import {
  PropsBeforeInjection,
  AnnuaireCreateComponent,
} from "./AnnuaireCreate.component";
import { RootState } from "../../../services/rootReducer";

const mapStateToProps = (state: RootState) => {
  return {
    structure: state.structure.userStructure,
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
interface InjectedProps extends StateProps {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const AnnuaireCreateContainer = compose<Props, PropsBeforeInjection>(
  connect<StateProps, {}, PropsBeforeInjection, RootState>(mapStateToProps)
)(AnnuaireCreateComponent);

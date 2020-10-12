import { connect } from "react-redux";
import { compose } from "recompose";
import {
  PropsBeforeInjection,
  AnnuaireCreateComponent,
} from "./AnnuaireCreate.component";
import { RootState } from "../../../services/rootReducer";
import {
  updateUserStructureActionCreator,
  setUserStructureActionCreator,
} from "../../../services/Structures/structures.actions";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { fetchUserActionCreator } from "../../../services/User/user.actions";

const mapStateToProps = (state: RootState) => {
  return {
    structure: state.structure.userStructure,
    isLoading:
      (state.loadingStatus[LoadingStatusKey.FETCH_USER_STRUCTURE] &&
        state.loadingStatus[LoadingStatusKey.FETCH_USER_STRUCTURE].isLoading) ||
      (state.loadingStatus[LoadingStatusKey.FETCH_USER] &&
        state.loadingStatus[LoadingStatusKey.FETCH_USER].isLoading),
    userId: state.user.userId,
  };
};

const mapDispatchToProps = {
  updateStructure: updateUserStructureActionCreator,
  fetchUser: fetchUserActionCreator,
  setStructure: setUserStructureActionCreator,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

interface InjectedProps extends StateProps {}
export interface Props
  extends PropsBeforeInjection,
    InjectedProps,
    DispatchProps {}

export const AnnuaireCreateContainer = compose<Props, PropsBeforeInjection>(
  connect<StateProps, {}, PropsBeforeInjection, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )
)(AnnuaireCreateComponent);

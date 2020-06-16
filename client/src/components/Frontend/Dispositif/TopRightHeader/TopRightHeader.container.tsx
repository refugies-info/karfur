import { connect } from "react-redux";
import { compose } from "recompose";
import {
  PropsBeforeInjection,
  TopRightHeader,
} from "./TopRightHeader.component";
import { RootState } from "../../../../services/rootReducer";

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user.user,
    admin: state.user.admin,
    selectedDispositif: state.selectedDispositif,
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
interface InjectedProps extends StateProps {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const TopRightHeaderContainer = compose<Props, PropsBeforeInjection>(
  connect<StateProps, {}, PropsBeforeInjection, RootState>(mapStateToProps)
)(TopRightHeader);

import { connect } from "react-redux";
import { compose } from "recompose";
import {
  PropsBeforeInjection,
  AnnuaireLectureComponent,
} from "./AnnuaireLecture.component";
import { RootState } from "../../../services/rootReducer";
import { withTranslation, WithTranslation } from "react-i18next";

const mapStateToProps = (state: RootState) => {
  return {
    structures: state.structure.structures,
  };
};

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

interface InjectedProps extends WithTranslation, StateProps {}
export interface Props
  extends PropsBeforeInjection,
    InjectedProps,
    DispatchProps {}

export const AnnuaireLectureContainer = compose<Props, PropsBeforeInjection>(
  connect<StateProps, {}, PropsBeforeInjection, RootState>(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(AnnuaireLectureComponent);

import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { compose } from "recompose";
import { PropsBeforeInjection, QuickToolbar } from "./QuickToolbar.component";
import { RootState } from "../../../services/rootReducer";

const mapStateToProps = (state: RootState) => {
  return {
    ttsActive: state.tts.ttsActive,
    activeLangue: state.langue.languei18nCode,
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
interface InjectedProps extends WithTranslation, StateProps {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const QuickToolbarContainer = compose<Props, PropsBeforeInjection>(
  connect<StateProps, {}, PropsBeforeInjection, RootState>(mapStateToProps),
  withTranslation()
)(QuickToolbar);

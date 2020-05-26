import track from "react-tracking";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { compose } from "recompose";
import { TOGGLE_TTS } from "../../../services/Tts/tts.actionTypes";
import { PropsBeforeInjection, QuickToolbar } from "./QuickToolbar.component";
import { RootState } from "../../../services/rootReducer";

const mapStateToProps = (state: RootState) => {
  return {
    ttsActive: state.tts.ttsActive,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleAudio: () => dispatch({ type: TOGGLE_TTS }),
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface InjectedProps extends WithTranslation, StateProps {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const QuickToolbarContainer = compose<Props, PropsBeforeInjection>(
  track(
    {
      layout: "QuickToolbar",
    },
    { dispatchOnMount: false }
  ),
  connect<StateProps, DispatchProps, PropsBeforeInjection, RootState>(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(QuickToolbar);

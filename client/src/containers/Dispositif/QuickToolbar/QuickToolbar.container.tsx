import track from "react-tracking";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { compose } from "recompose";
import * as actions from "../../../services/actions/actionTypes";
import { PropsBeforeInjection, QuickToolbar } from "./QuickToolbar.component";

// TO DO : type state with RootState : type of root reducer
type RootState = any;
const mapStateToProps = (state: RootState) => {
  return {
    ttsActive: state.tts.ttsActive,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleAudio: () => dispatch({ type: actions.TOGGLE_TTS }),
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
  withTranslation
)(QuickToolbar);

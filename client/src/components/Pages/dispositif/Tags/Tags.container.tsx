import { connect } from "react-redux";
import { compose } from "recompose";
import { PropsBeforeInjection, Tags } from "./Tags.component";
import { RootState } from "services/rootReducer";
import { withTranslation, WithTranslation } from "react-i18next";
import { deleteTagActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";

// TO DO : use redux instead of state local, be careful that info are synchronized
const mapStateToProps = (state: RootState) => {
  return {
    tagsNotReady: state.selectedDispositif && state.selectedDispositif.tags,
  };
};

const mapDispatchToProps = {
  deleteTagNotReady: deleteTagActionCreator,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
interface InjectedProps extends StateProps, WithTranslation, DispatchProps {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const TagsContainer = compose<Props, PropsBeforeInjection>(
  connect<StateProps, {}, PropsBeforeInjection, RootState>(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(Tags);

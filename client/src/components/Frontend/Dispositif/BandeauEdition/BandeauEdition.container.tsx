import { connect } from "react-redux";
import { compose } from "recompose";
import {
  PropsBeforeInjection,
  BandeauEdition,
} from "./BandeauEdition.component";
import { RootState } from "services/rootReducer";
import { UiElement } from "services/SelectedDispositif/selectedDispositif.reducer";

const mapStateToProps = (state: RootState) => ({
  menu: (!!state.selectedDispositif && state.selectedDispositif.contenu) || [],
  uiArray:
    (!!state.selectedDispositif && state.selectedDispositif.uiArray) || [],
});

type StateProps = ReturnType<typeof mapStateToProps>;
interface InjectedProps extends StateProps {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const BandeauEditionContainer = compose<Props, PropsBeforeInjection>(
  connect<StateProps, {}, PropsBeforeInjection, RootState>(mapStateToProps)
)(BandeauEdition);

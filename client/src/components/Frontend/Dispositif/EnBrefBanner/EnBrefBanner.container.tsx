import { withTranslation } from "next-i18next";
import { WithTranslation } from "react-i18next";
import { compose } from "recompose";
import { PropsBeforeInjection, EnBrefBanner } from "./EnBrefBanner.component";
import { RootState } from "services/rootReducer";
import { connect } from "react-redux";

// not ready to take menu from store because it does not update yet when modifying something
const mapStateToProps = (state: RootState) => {
  return {
    menuNotReady: state.selectedDispositif && state.selectedDispositif.contenu,
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
interface InjectedProps extends WithTranslation, StateProps {}
export interface Props extends PropsBeforeInjection, InjectedProps {}

export const EnBrefBannerContainer = compose<Props, PropsBeforeInjection>(
  connect<StateProps, {}, PropsBeforeInjection, RootState>(mapStateToProps),
  withTranslation()
)(EnBrefBanner);

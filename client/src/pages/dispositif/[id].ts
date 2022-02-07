import Dispositif from "components/Frontend/Dispositif/Dispositif"
import { wrapper } from "services/configureStore";
import { END } from "redux-saga";
import { fetchSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";

export const getServerSideProps = wrapper.getServerSideProps(store => async ({query}) => {
  if (query.id) {
    const action = fetchSelectedDispositifActionCreator({
      selectedDispositifId: query.id as string,
      locale: "fr" // TODO: fix language here
    });
    store.dispatch(action);
    store.dispatch(END);
    await store.sagaTask?.toPromise();
  }
  return {props: {}}
});

export default Dispositif;

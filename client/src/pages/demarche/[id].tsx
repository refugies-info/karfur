import Dispositif from "components/Frontend/Dispositif/Dispositif"
import { wrapper } from "services/configureStore";
import { END } from "redux-saga";
import { fetchSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";
import { fetchUserActionCreator } from "services/User/user.actions";

const DispositifPage = () => <Dispositif type="detail" />

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ query }) => {
  if (query.id) {
    const action = fetchSelectedDispositifActionCreator({
      selectedDispositifId: query.id as string,
      locale: "fr" // TODO: fix language here
    });
    store.dispatch(action);
    store.dispatch(fetchUserActionCreator());
    store.dispatch(END);
    await store.sagaTask?.toPromise();
  }

  // 404
  if (
    !store.getState().selectedDispositif ||
    store.getState().selectedDispositif.typeContenu !== "demarche"
  ) {
    return { notFound: true }
  }

  // 200
  return {props: {}}
});

export default DispositifPage;

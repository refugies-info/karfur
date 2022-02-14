import Dispositif from "components/Frontend/Dispositif/Dispositif"
import { defaultStaticProps } from "lib/getDefaultStaticProps";

const DispositifPage = () => <Dispositif type="create" typeContenu="demarche" />

export const getStaticProps = defaultStaticProps;

export default DispositifPage;

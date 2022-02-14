import Dispositif from "components/Frontend/Dispositif/Dispositif"
import { defaultStaticProps } from "lib/getDefaultStaticProps";

const DispositifPage = () => <Dispositif type="create" typeContenu="dispositif" />

export const getStaticProps = defaultStaticProps;

export default DispositifPage;

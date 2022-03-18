import Dispositif from "components/Frontend/Dispositif/Dispositif"
import { defaultStaticProps } from "lib/getDefaultStaticProps";

interface Props {
  history: string[]
}

const DispositifPage = (props: Props) => <Dispositif type="create" typeContenu="demarche" history={props.history} />

export const getStaticProps = defaultStaticProps;

export default DispositifPage;

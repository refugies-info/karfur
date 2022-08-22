import Dispositif from "components/Frontend/Dispositif/Dispositif"
import { defaultStaticPropsWithThemes } from "lib/getDefaultStaticProps";

interface Props {
  history: string[]
}

const DispositifPage = (props: Props) => <Dispositif type="create" typeContenu="demarche" history={props.history} />

export const getStaticProps = defaultStaticPropsWithThemes;

export default DispositifPage;

interface Props {
  error: string;
}

const Error = ({ error }: Props) => (!!error ? <p className="fr-error-text">{error}</p> : null);

export default Error;

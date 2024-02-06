interface Props {
  error: string | undefined;
}

const ErrorMessage = ({ error }: Props) => (!!error ? <p className="fr-error-text">{error}</p> : null);

export default ErrorMessage;

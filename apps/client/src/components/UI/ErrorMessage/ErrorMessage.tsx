interface Props {
  error: string | undefined | null;
  /** Set it to point an aria-describedby at this message from the faulty field. */
  id?: string;
}

const ErrorMessage = ({ error, id }: Props) =>
  error ? (
    <p className="fr-error-text" id={id}>
      {error}
    </p>
  ) : null;

export default ErrorMessage;

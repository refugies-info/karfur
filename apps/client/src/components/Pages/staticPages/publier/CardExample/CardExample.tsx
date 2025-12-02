interface Props {
  exampleOk: string;
  exampleKo: string;
}

const CardExample = (props: Props) => {
  return (
    <div className="text-normal !space-y-3">
      <p className="flex">
        <i aria-hidden="true" className="fr-icon-close-circle-fill text-default-error me-2 h-6 w-6" />
        <span className="sr-only">Mauvais exemple d'action :</span>
        {props.exampleKo}
      </p>
      <p className="!mb-0 flex">
        <i aria-hidden="true" className="fr-icon-success-fill text-default-success me-2 h-6 w-6" />
        <span className="sr-only">Bon exemple d'action :</span>
        {props.exampleOk}
      </p>
    </div>
  );
};

export default CardExample;

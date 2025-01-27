interface Props {
  exampleOk: string;
  exampleKo: string;
}

const CardExample = (props: Props) => {
  return (
    <div className="text-normal !space-y-3">
      <p className="flex">
        <i className="fr-icon-close-circle-fill h-6 w-6 me-2 text-error" />
        {props.exampleKo}
      </p>
      <p className="flex !mb-0">
        <i className="fr-icon-success-fill h-6 w-6 me-2 text-success" />
        {props.exampleOk}
      </p>
    </div>
  );
};

export default CardExample;

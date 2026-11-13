import CountUp from "react-countup";
import { InView } from "react-intersection-observer";

interface Props {
  number: number;
  text: string;
}

const CountUpFigure = (props: Props) => {
  return (
    <InView>
      {({ inView, ref }) => (
        <p ref={ref} className="mb-0 flex-1 text-center">
          <span className="text-title-blue-france text-alt-title lg:text-alt-title-big block font-bold">
            {inView ? <CountUp end={props.number} separator=" " /> : 0}
          </span>{" "}
          <span className="text-title-blue-france text-chapo mt-6 block font-bold">
            {props.text}
          </span>
        </p>
      )}
    </InView>
  );
};

export default CountUpFigure;

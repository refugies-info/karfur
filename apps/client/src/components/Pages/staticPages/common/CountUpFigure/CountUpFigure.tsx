import CountUp from "react-countup";
import { InView } from "react-intersection-observer";

interface Props {
  number: number;
  text: string;
}

// One paragraph per statistic, figure and label together (RGAA 8.9). Spans keep the markup
// valid: a paragraph cannot contain block elements.
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

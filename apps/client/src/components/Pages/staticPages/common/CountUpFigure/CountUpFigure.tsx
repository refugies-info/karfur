import CountUp from "react-countup";
import { InView } from "react-intersection-observer";

interface Props {
  number: number;
  text: string;
}

const CountUpFigure = (props: Props) => {
  return (
    <div className="flex-1 text-center">
      <div className="text-title-blue-france text-alt-title lg:text-alt-title-big font-bold">
        <InView>
          {({ inView, ref }) => (
            <div ref={ref}>{inView ? <CountUp end={props.number} separator=" " /> : 0}</div>
          )}
        </InView>
      </div>
      <p className="text-title-blue-france text-chapo mt-6 mb-0 font-bold">{props.text}</p>
    </div>
  );
};

export default CountUpFigure;

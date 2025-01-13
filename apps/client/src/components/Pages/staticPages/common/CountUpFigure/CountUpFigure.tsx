import CountUp from "react-countup";
import { InView } from "react-intersection-observer";

interface Props {
  number: number;
  text: string;
}

const CountUpFigure = (props: Props) => {
  return (
    <div className="text-center flex-1">
      <div className="text-blue-france text-alt-title lg:text-alt-title-big font-bold">
        <InView>
          {({ inView, ref }) => <div ref={ref}>{inView ? <CountUp end={props.number} separator=" " /> : 0}</div>}
        </InView>
      </div>
      <p className="mt-6 mb-0 text-blue-france text-chapo font-bold">{props.text}</p>
    </div>
  );
};

export default CountUpFigure;

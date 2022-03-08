import React from "react";
import {displayDistance, displayDuration, displayPace} from "./Utils/Display";
import {Dimension} from "./Utils/Conversion";
import {SegmentData, Range} from "./Utils/Interfaces";
import {ReactComponent as StopwatchIcon} from './Assets/stopwatch.svg';
import {ReactComponent as PathIcon} from './Assets/path-2.svg';
import {ReactComponent as ShoeIcon} from './Assets/shoe.svg';


export interface SegmentProps {
  data: SegmentData;
  isTally: boolean;
}

export const Segment: React.FC<SegmentProps> = ({
  data,
  isTally,
}: SegmentProps) => {
  let backgroundColor, textColor, svgColor;
  if (isTally) {
    backgroundColor = "bg-gradient-to-r from-gold to-orange hover:bg-gradient-to-br focus:ring-4 focus:ring-orange dark:focus:ring-gold";
    textColor = "text-blue-700";
    svgColor = "fill-blue-700 stroke-blue-700";
  } else {
    backgroundColor = "bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-500 dark:focus:ring-blue-700";
    textColor = "text-cream";
    svgColor = "fill-cream stroke-cream";
  };
  return (
    <div
      className={`${textColor} ${backgroundColor} font-medium rounded-lg  my-2 p-4`}
    >
      {isTally ? <div className="mb-1">Total</div> : null}
      <SegmentLine
        svgColor={svgColor}
        dimension={Dimension.Distance}
        range={{
          high: data.distance.high / 1000,
          low: data.distance.low / 1000,
        }}
      />
      <SegmentLine
        svgColor={svgColor}
        dimension={Dimension.Duration}
        range={data.duration}
      />
      <SegmentLine
        svgColor={svgColor}
        dimension={Dimension.Pace}
        range={{
          // Invert values: high speed is low pace and inversely
          high: 1000 / data.speed.low,
          low: 1000 / data.speed.high,
        }}
      />
    </div>
  );
};

function rangeToString(range: Range, dimension: Dimension): string {
  let format = segmentDataFormatMap[dimension]
  if (range.low === range.high || isNaN(range.low) || isNaN(range.high)) {
    return format(range.low)
  }
  return `${format(range.low)}-${format(range.high)}`
}


const iconMap: Record<Dimension, JSX.Element> = {
  [Dimension.Distance]: <PathIcon />,
  [Dimension.Duration]: <StopwatchIcon />,
  [Dimension.Pace]: <ShoeIcon />,
};

const segmentDataFormatMap: Record<Dimension, CallableFunction> = {
  [Dimension.Distance]: displayDistance,
  [Dimension.Duration]: displayDuration,
  [Dimension.Pace]: displayPace,
};

export function SegmentLine(props: {
  svgColor: string,
  dimension: Dimension,
  range: Range
}) {
  let svgClassName = `${props.svgColor} h-6 w-6 mr-4`;
  let icon = <div className={svgClassName}>{iconMap[props.dimension]}</div>;
  return (
    <div className="flex items-center my-2">
      {icon}
      <div className="flex grow items-center">
        <div className="grow font-semibold">{props.dimension}</div>
        <div>{rangeToString(props.range, props.dimension)}</div>
      </div>
    </div>
  )
}

import React from "react";
import {displayNumber, displayDuration, displayPace} from "./Utils/Display";
import {Dimension} from "./Utils/Conversion";
import {ReactComponent as StopwatchIcon} from './Assets/stopwatch.svg';
import {ReactComponent as PathIcon} from './Assets/path-2.svg';
import {ReactComponent as ShoeIcon} from './Assets/shoe.svg';


export interface SegmentProps {
  distance: number; // In meters
  duration: number; // In seconds
  speed: number; // In meters per second
  isTally: boolean;
}

export const Segment: React.FC<SegmentProps> = ({
  distance,
  duration,
  speed,
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
        segmentValue={`${displayNumber(distance / 1000)}km`}
      />
      <SegmentLine
        svgColor={svgColor}
        dimension={Dimension.Duration}
        segmentValue={`${displayDuration(duration)}`}
      />
      <SegmentLine
        svgColor={svgColor}
        dimension={Dimension.Pace}
        segmentValue={`${displayPace(1000 / speed)}`}
      />
    </div>
  );
};


const iconMap: Record<Dimension, JSX.Element> = {
  [Dimension.Distance]: <PathIcon />,
  [Dimension.Duration]: <StopwatchIcon />,
  [Dimension.Pace]: <ShoeIcon />,
};

export function SegmentLine(props: {
  svgColor: string,
  dimension: Dimension,
  segmentValue: string
}) {
  let svgClassName = `${props.svgColor} h-6 w-6 mr-4`;
  let icon = <div className={svgClassName}>{iconMap[props.dimension]}</div>;
  return (
    <div className="flex items-center my-2">
      {icon}
      <div className="flex grow items-center">
        <div className="grow font-semibold">{props.dimension}</div>
        <div>{props.segmentValue}</div>
      </div>
    </div>
  )
}

import React from "react";
import {displayDistance, displayDuration, displayPace} from "./Utils/Display";
import {Dimension} from "./Utils/Conversion";
import {classNames} from "./Utils/Css";
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
      <div className="grid grid-cols-12 gap-1">
        <SegmentTitle isTally={isTally} repeat={data.repeat} />
        <SegmentLine
          svgColor={svgColor}
          dimension={Dimension.Distance}
          range={{
            high: data.distance.high / 1000,
            low: data.distance.low / 1000,
          }}
          repeat={data.repeat}
        />
        <SegmentLine
          svgColor={svgColor}
          dimension={Dimension.Duration}
          range={data.duration}
          repeat={data.repeat}
        />
        <SegmentLine
          svgColor={svgColor}
          dimension={Dimension.Pace}
          range={{
            // Invert values: high speed is low pace and inversely
            high: 1000 / data.speed.low,
            low: 1000 / data.speed.high,
          }}
          repeat={1}
        />
      </div>
    </div>
  );
};

function repeatRange(range: Range, repeat: number): Range {
  return {
    high: range.high * repeat,
    low: range.low * repeat,
  }
}


function rangeToString(range: Range, dimension: Dimension): string {
  let format = segmentDataFormatMap[dimension]
  if (range.low === range.high || isNaN(range.low) || isNaN(range.high)) {
    return format(range.low, true)
  }
  return `${format(range.low, false)}-${format(range.high, true)}`
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
  range: Range,
  repeat: number
}) {
  return props.repeat > 1
    ? <SegmentLineWithRepeats
      svgColor={props.svgColor}
      dimension={props.dimension}
      range={props.range}
      repeat={props.repeat}
    />
    : <SegmentLineWithoutRepeats
      svgColor={props.svgColor}
      dimension={props.dimension}
      range={props.range}
    />;
}

function SegmentLineWithoutRepeats(props: {
  svgColor: string,
  dimension: Dimension,
  range: Range,
}) {
  return (
    <>
      <div className={classNames(
        `${props.svgColor}`,
        "h-6 w-6 col-span-1 pr-1"
      )}>{iconMap[props.dimension]}</div>
      <div className="col-span-3">
        {props.dimension}
      </div>
      <div className="col-span-8 justify-self-end">
        {rangeToString(props.range, props.dimension)}
      </div>
    </>
  )
}

function SegmentLineWithRepeats(props: {
  svgColor: string,
  dimension: Dimension,
  range: Range,
  repeat: number
}) {
  return (
    <>
      <div className={classNames(
        `${props.svgColor}`,
        "h-6 w-6 col-span-1 pr-1"
      )}>{iconMap[props.dimension]}</div>
      <div className="col-span-3">
        {props.dimension}
      </div>
      <div className="col-span-4 justify-self-end">
        {rangeToString(props.range, props.dimension)}
      </div>
      <div className="col-span-4 justify-self-end">
        {rangeToString(repeatRange(props.range, props.repeat), props.dimension)}
      </div>
    </>
  )
}

function SegmentTitle(props: {
  isTally: boolean,
  repeat: number
}) {
  return (props.isTally
    ? <div className="col-span-12">Total</div>
    : props.repeat > 1
      ? <>
        <div className="col-start-5 col-span-4 justify-self-end">{"x1"}</div>
        <div className="col-start-9 col-span-4 justify-self-end">{`x${props.repeat}`}</div>
      </>
      : null)
}

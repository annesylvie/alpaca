import React from "react";
import {displayNumber, displayDuration, displayPace} from "./Utils/Display";


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
  let backgroundColor, textColor;
  if (isTally) {
    backgroundColor = "bg-gradient-to-r from-gold to-orange hover:bg-gradient-to-br focus:ring-4 focus:ring-orange dark:focus:ring-gold";
    textColor = "text-blue-800";
  } else {
    backgroundColor = "bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-500 dark:focus:ring-blue-700";
    textColor = "text-cream";
  };
  return (
    <div
      className={`${textColor} ${backgroundColor} font-medium rounded-lg  my-2 p-4`}
    >
      {isTally ? <div className="mb-1">Total</div> : null}
      <div>Distance: {displayNumber(distance / 1000)}km</div>
      <div>Duration: {displayDuration(duration)}</div>
      <div>Pace: {displayPace(1000 / speed)}</div>
    </div>
  );
};

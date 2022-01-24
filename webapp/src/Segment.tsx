import React from "react";

export interface ISegment {
  distance: number; // In meters
  duration: number; // In seconds
  speed: number; // In meters per second
}

export function getDistance(pace: number, duration: number): ISegment {
  const speed = 1000 / pace;
  return {
    distance: speed * duration,
    duration,
    speed,
  };
}

export function getDuration(pace: number, distanceInKm: number): ISegment {
  const speed = 1000 / pace;
  const distance = distanceInKm * 1000;
  return {
    distance,
    duration: distance / speed,
    speed,
  };
}

export function getPace(
  distanceInKm: number,
  duration: number
): ISegment {
  const distance = distanceInKm * 1000;
  return {
    distance,
    duration,
    speed: distance / duration,
  };
}

export function sumSegments(segments: Array<ISegment>): ISegment {
  let totalDistance = 0;
  let totalDuration = 0;
  segments.forEach((segment) => {
    totalDuration += segment.duration;
    totalDistance += segment.distance;
  });
  return {
    duration: totalDuration,
    distance: totalDistance,
    speed: totalDistance / totalDuration,
  };
}

function displayNumber(numberToDisplay: number): string {
  return Number.isFinite(numberToDisplay) ? numberToDisplay.toFixed(2) : "—";
}

function secondsToHMSString(seconds: number): string {
  if (seconds === 0) {
    return "0s";
  }
  const date = new Date(Math.round(seconds * 1000));
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const secondsToDisplay = date.getUTCSeconds();
  let stringWithHours = hours > 0 ? `${hours}h` : "";
  let stringWithMinutes = stringWithHours.concat(minutes > 0 ? `${minutes}min` : "");
  let stringWithSeconds = stringWithMinutes.concat(secondsToDisplay > 0 ? `${secondsToDisplay}s` : "");
  return stringWithSeconds;
}

function displayPace(seconds: number): string {
  return Number.isFinite(seconds) ? `${secondsToHMSString(seconds)}/km` : "—min/km";
}

function displayDuration(seconds: number): string {
  return secondsToHMSString(seconds);
}

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

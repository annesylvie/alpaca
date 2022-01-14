import React from "react";

export interface ISegment {
  distance: number; // In meters
  duration: number; // In seconds
  speed: number; // In meters per second
}

function paceSpeedConversion(paceOrSpeed: number): number {
  /// Converts pace in minutes per kilometers into speed in meters per second or
  /// the other way around
  return 1000 / (60 * paceOrSpeed);
}

export function getDistance(pace: number, durationInMinutes: number): ISegment {
  const speed = paceSpeedConversion(pace);
  const duration = durationInMinutes * 60;
  return {
    distance: speed * duration,
    duration,
    speed,
  };
}

export function getDuration(pace: number, distanceInKm: number): ISegment {
  const speed = paceSpeedConversion(pace);
  const distance = distanceInKm * 1000;
  return {
    distance,
    duration: distance / speed,
    speed,
  };
}

export function getPace(
  distanceInKm: number,
  durationInMinutes: number
): ISegment {
  const duration = durationInMinutes * 60;
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
  segments.map((segment) => {
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
  return numberToDisplay.toFixed(2);
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
  const color = isTally
    ? "from-yellow-300 to-red-500"
    : "from-green-400 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800";
  return (
    <div
      className={`text-white bg-gradient-to-r ${color} font-medium rounded-lg text-sm my-2 p-4`}
    >
      <div>Distance: {displayNumber(distance / 1000)}km</div>
      <div>Duration: {displayNumber(duration / 60)}min</div>
      <div>Pace: {displayNumber(paceSpeedConversion(speed))}min/km</div>
    </div>
  );
};

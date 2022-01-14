import React from "react";

export interface ISegment {
  distance: number; // In meters
  duration: number; // In seconds
  speed: number; // In meters per second
}

function paceToSpeed(pace: number): number {
  /// Converts pace in minutes per kilometers into speed in meters per second
  return 1000 / (60 * pace);
}

function speedToPace(speed: number): number {
  /// Converts speed in meters per second into pace in minutes per kilometers
  return 1000 / (60 * speed);
}

export function getDistance(pace: number, durationInMinutes: number): ISegment {
  const speed = paceToSpeed(pace);
  const duration = durationInMinutes * 60;
  return {
    distance: speed * duration,
    duration,
    speed,
  };
}

export function getDuration(pace: number, distanceInKm: number): ISegment {
  const speed = paceToSpeed(pace);
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

function displayNumber(numberToDisplay: number): string {
  return numberToDisplay.toFixed(2);
}

export const Segment: React.FC<ISegment> = ({
  distance,
  duration,
  speed,
}: ISegment) => {
  console.log(speed);
  console.log(speedToPace(speed));
  return (
    <div className="text-white bg-gradient-to-r from-green-400 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm my-2 p-4">
      <div>Distance: {displayNumber(distance / 1000)}km</div>
      <div>Duration: {displayNumber(duration / 60)}min</div>
      <div>Pace: {displayNumber(speedToPace(speed))}min/km</div>
    </div>
  );
};

import React from "react";

export interface ISegment {
  distance: number; // In meters
  duration: number; // In seconds
  pace: number; // In meters per second
}

export const Segment: React.FC<ISegment> = ({
  distance,
  duration,
  pace,
}: ISegment) => {
  return (
    <div className="text-white bg-gradient-to-r from-green-400 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm my-2 p-4">
      <div>Distance: {distance}</div>
      <div>Duration: {duration}</div>
      <div>Pace: {pace}</div>
    </div>
  );
};

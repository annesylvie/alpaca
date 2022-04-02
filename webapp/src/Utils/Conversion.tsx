import {SegmentData, Range} from "./Interfaces";

export enum Dimension {
  Distance = "Distance",
  Duration = "Duration",
  Pace = "Pace"
}

/// Functions to convert from basic numbers to a SegmentData
export function getDistance(pace: Range, duration: number): SegmentData {
  const lowSpeed = 1000 / pace.low;
  const highSpeed = 1000 / pace.high;
  return {
    distance: {high: highSpeed * duration, low: lowSpeed * duration},
    duration: {high: duration, low: duration},
    speed: {high: highSpeed, low: lowSpeed},
  };
}

export function getDuration(pace: Range, distanceInKm: number): SegmentData {
  const lowSpeed = 1000 / pace.low;
  const highSpeed = 1000 / pace.high;
  const distance = distanceInKm * 1000;
  return {
    distance: {high: distance, low: distance},
    // Lower speed means longer duration to cover the same distance
    duration: {
      high: distance / lowSpeed, low: distance / highSpeed
    },
    speed: {high: highSpeed, low: lowSpeed},
  };
}

export function getPace(
  distanceInKm: number,
  duration: number
): SegmentData {
  const distance = distanceInKm * 1000;
  return {
    distance: {high: distance, low: distance},
    duration: {high: duration, low: duration},
    speed: {high: distance / duration, low: distance / duration},
  };
}

export function sumSegments(segments: Array<SegmentData>): SegmentData {
  let totalDuration = {high: 0, low: 0};
  let totalDistance = {high: 0, low: 0};
  segments.forEach((segment) => {
    totalDuration.high += segment.duration.high;
    totalDuration.low += segment.duration.low;
    totalDistance.high += segment.distance.high;
    totalDistance.low += segment.distance.low;
  });
  return {
    duration: totalDuration,
    distance: totalDistance,
    speed: {
      high: totalDistance.high / totalDuration.low,
      low: totalDistance.low / totalDuration.high
    },
  };
}


export function hmsToSeconds(input: string): number {
  let hmsSplit = input.split(':');
  let seconds = 0;
  let minutes = 1;

  while (hmsSplit.length > 0) {
    const nextHmsElement = hmsSplit.pop();
    if (nextHmsElement !== undefined) {
      seconds += minutes * parseInt(nextHmsElement, 10);
      minutes *= 60;
    }
  }

  return seconds;
}

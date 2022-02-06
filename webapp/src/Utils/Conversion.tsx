import {ISegment} from "./Interfaces";

/// Functions to convert from basic numbers to a ISegment
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

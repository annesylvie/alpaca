export interface SegmentData {
  distance: Range; // In meters
  duration: Range; // In seconds
  speed: Range; // In meters per second
}

export interface Range {
  high: number;
  low: number;
}

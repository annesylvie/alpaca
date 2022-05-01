export function displayNumber(numberToDisplay: number): string {
  return Number.isFinite(numberToDisplay) ? numberToDisplay.toFixed(2) : "—";
}

export function secondsToHMSString(seconds: number): string {
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

export function secondsToNumbersAndColons(seconds: number): string {
  if (seconds === 0) {
    return "00:00";
  }
  const date = new Date(Math.round(seconds * 1000));
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const secondsToDisplay = date.getUTCSeconds();
  let stringWithHours = hours > 0 ? `${hours}:` : "";
  let stringWithMinutes = stringWithHours.concat(minutes > 0 ? `${minutes}:` : "00:");
  let stringWithSeconds = stringWithMinutes.concat(secondsToDisplay > 0 ? `${secondsToDisplay}` : "00");
  return stringWithSeconds;
}

export function displayPace(seconds: number, displayUnit: boolean): string {
  return !Number.isFinite(seconds) ? "-min/km" : displayUnit ? `${secondsToNumbersAndColons(seconds)}/km` : `${secondsToNumbersAndColons(seconds)}`;
}

export function displayDuration(seconds: number, displayUnit: boolean): string {
  // Always display units for duration
  return secondsToHMSString(seconds);
}

export function displayDistance(km: number, displayUnit: boolean): string {
  return displayUnit ? `${displayNumber(km)}km` : `${displayNumber(km)}`
}

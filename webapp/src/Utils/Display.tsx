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

export function displayPace(seconds: number): string {
  return Number.isFinite(seconds) ? `${secondsToHMSString(seconds)}/km` : "—min/km";
}

export function displayDuration(seconds: number): string {
  return secondsToHMSString(seconds);
}

export function displayDistance(km: number): string {
  return `${displayNumber(km)}km`
}

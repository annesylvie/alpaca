import {hmsToSeconds} from "./Conversion";

test("hmsToSeconds returns correct number", () => {
  // Test colon-based time parsing
  expect(hmsToSeconds("0")).toBe(0);
  expect(hmsToSeconds("00")).toBe(0);
  expect(hmsToSeconds("10")).toBe(10);
  expect(hmsToSeconds("00:00")).toBe(0);
  expect(hmsToSeconds("10:00")).toBe(10 * 60);
  expect(hmsToSeconds("1:00:00")).toBe(60 * 60);
  expect(hmsToSeconds("1:30:04")).toBe(60 * 60 + 30 * 60 + 4);

  // Test word-based time parsing
  expect(hmsToSeconds("4s")).toBe(4);
  expect(hmsToSeconds("1min")).toBe(60);
  expect(hmsToSeconds("1min30s")).toBe(60 + 30);
  expect(hmsToSeconds("1min3s")).toBe(60 + 3);
  expect(hmsToSeconds("1h1min30s")).toBe(60 * 60 + 60 + 30);
  expect(hmsToSeconds("1h1min")).toBe(60 * 60 + 60);
  expect(hmsToSeconds("1h01min30s")).toBe(60 * 60 + 60 + 30);
  expect(hmsToSeconds("1h10min")).toBe(60 * 60 + 10 * 60);
  expect(hmsToSeconds("1h10s")).toBe(60 * 60 + 10);
  expect(hmsToSeconds("180s")).toBe(180);
  expect(hmsToSeconds("180min")).toBe(60 * 180);
  expect(hmsToSeconds("1h180min")).toBe(60 * 60 + 60 * 180);
});

export {}

import {useState, useMemo} from "react";
import {Segment} from "./Segment";
import {ISegment} from "./Utils/Interfaces";
import {sumSegments} from "./Utils/Conversion";
import {SegmentForm} from "./SegmentForm";

export function SegmentsPage() {
  const [segments, setSegments] = useState<Array<ISegment>>([]);
  const tally = useMemo(() => sumSegments(segments), [segments]);

  return (
    <div className="flex justify-center">
      <div className="m-4 p-4 w-3/5 max-w-lg">
        {segments.map((segment) => (
          <Segment
            distance={segment.distance}
            duration={segment.duration}
            speed={segment.speed}
            isTally={false}
          />
        ))}
        <Segment
          distance={tally.distance}
          duration={tally.duration}
          speed={tally.speed}
          isTally={true}
        />
        <SegmentForm setSegments={setSegments} />
      </div>
    </div>
  );
}

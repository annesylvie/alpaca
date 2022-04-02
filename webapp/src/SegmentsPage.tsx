import {useState, useMemo} from "react";
import {Segment} from "./Segment";
import {SegmentData} from "./Utils/Interfaces";
import {sumSegments} from "./Utils/Conversion";
import {SegmentForm} from "./SegmentForm";

export function SegmentsPage() {
  const [segments, setSegments] = useState<Array<SegmentData>>([]);
  const tally = useMemo(() => sumSegments(segments), [segments]);

  return (
    <div className="flex justify-center">
      <div className="m-4 p-4 w-4/5 max-w-lg">
        {segments.map((segment) => (
          <Segment
            data={segment}
            isTally={false}
          />
        ))}
        <Segment
          data={tally}
          isTally={true}
        />
        <SegmentForm setSegments={setSegments} />
      </div>
    </div>
  );
}

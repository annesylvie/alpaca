import {useMemo, useEffect, useState, Dispatch, SetStateAction} from "react";
import {useSearchParams} from "react-router-dom";
import {Segment} from "./Segment";
import {SegmentData} from "./Utils/Interfaces";
import {sumSegments} from "./Utils/Conversion";
import {SegmentForm} from "./SegmentForm";

export function useAndUpdateParams<Type>(props: {json: string | null}): [Array<Type>, Dispatch<SetStateAction<Array<Type>>>] {
  const savedData = props.json === null ? [] : JSON.parse(props.json);
  const [data, setData] = useState<Array<Type>>(savedData);
  return [data, setData];
}

export function SegmentsPage() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [segments, setSegments] = useAndUpdateParams<SegmentData>({
    json: searchParams.get("segmentsOnMainPage")
  });
  const tally = useMemo(() => sumSegments(segments), [segments]);
  useEffect(() => {
    setSearchParams({segmentsOnMainPage: JSON.stringify(segments)})
  },
    [segments, setSearchParams]);

  return (
    <div className="flex justify-center">
      <div className="m-4 p-4 w-4/5 max-w-lg">
        {segments.map((segment, index) => (
          <Segment
            key={index}
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

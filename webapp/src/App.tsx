import {useState, useMemo} from "react";
import "./App.css";
import {Segment, ISegment, sumSegments} from "./Segment";
import {Form} from "./Form";

function App() {
  const [segments, setSegments] = useState<Array<ISegment>>([]);
  const tally = useMemo(() => sumSegments(segments), [segments]);

  return (
    <div className="grid place-items-center">
      <div className="bg-gray-200 rounded-lg m-4 p-4 ">
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
        <Form setSegments={setSegments} />
      </div>
    </div>
  );
}


export default App;

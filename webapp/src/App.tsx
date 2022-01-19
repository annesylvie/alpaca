import {useState, useEffect, useMemo} from "react";
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

function MyComponent() {
  const [error, setError] = useState<{message: string} | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<{message: string} | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/hello/boo")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error !== null) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return <div>Hi: {items === null ? "" : items["message"]}</div>;
  }
}

export default App;

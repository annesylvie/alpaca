import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import "./App.css";
import { Box } from "./Box";
import { FormCreator } from "./Form";

function App() {
  const [boxes, setBoxes] = useState<Array<string>>([]);
  const [showFields, setShowFields] = useState(false);

  return (
    <div className="grid place-items-center">
      <div className="bg-gray-200 rounded-lg m-4 p-4 ">
        {boxes.map((box) => (
          <Box fieldName={box} />
        ))}
        <FormCreator
          showFields={showFields}
          setShowFields={setShowFields}
          boxes={boxes}
          setBoxes={setBoxes}
        />
      </div>
    </div>
  );
}

function MyComponent() {
  const [error, setError] = useState<{ message: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<{ message: string } | null>(null);

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

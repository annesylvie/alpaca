import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import "./App.css";

function App() {
  const [boxes, setBoxes] = useState<Array<string>>([]);
  const [showFields, setShowFields] = useState(false);

  return (
    <div className="bg-gray-200 rounded-lg m-4 p-4">
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
  );
}

function Box(props: { fieldName: string }) {
  return (
    <div className="text-white bg-gradient-to-r from-green-400 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm text-center my-2 p-4">
      {" "}
      Name: {props.fieldName}{" "}
    </div>
  );
}

export const useForm = (callback: any, initialState: { user: string }) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await callback();
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};

function Form(props: {
  setShowFields: Dispatch<SetStateAction<boolean>>;
  boxes: Array<string>;
  setBoxes: Dispatch<SetStateAction<Array<string>>>;
}) {
  const initialState = { user: "" };
  const { onChange, onSubmit, values } = useForm(addBoxCallback, initialState);

  async function addBoxCallback() {
    props.setShowFields(false);
    props.setBoxes((boxes) => [...boxes, values["user"]]);
  }

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-md rounded px-8 py-6 mb-4"
      >
        <div>
          <label className="block text-gray-700 text-sm font-bold my-2">
            Input
          </label>
          <input
            className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            placeholder="Value"
            name="user"
            onChange={onChange}
            required
          />
        </div>
        <div className="flex items-center">
          <button
            type="submit"
            className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

interface IFormProps {
  showFields: boolean;
  setShowFields: Dispatch<SetStateAction<boolean>>;
  boxes: Array<string>;
  setBoxes: Dispatch<SetStateAction<Array<string>>>;
}

export const FormCreator: React.FC<IFormProps> = ({
  showFields,
  setShowFields,
  boxes,
  setBoxes,
}: IFormProps) => {
  return (
    <div className="flex justify-center">
      {showFields ? (
        <Form setShowFields={setShowFields} boxes={boxes} setBoxes={setBoxes} />
      ) : (
        <div>
          <button
            type="submit"
            className="text-white bg-blue-700 font-medium rounded-lg text-sm text-center p-4"
            onClick={() => setShowFields(true)}
          >
            Add New
          </button>
        </div>
      )}
    </div>
  );
};

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

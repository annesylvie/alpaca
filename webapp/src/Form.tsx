import React, { useState, Dispatch, SetStateAction } from "react";
import { ISegment } from "./Box";

export const useForm = (callback: any, initialState: { distance: string }) => {
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

export function Form(props: {
  setShowFields: Dispatch<SetStateAction<boolean>>;
  segments: Array<ISegment>;
  setSegments: Dispatch<SetStateAction<Array<ISegment>>>;
}) {
  const initialState = { distance: "" };
  const { onChange, onSubmit, values } = useForm(addBoxCallback, initialState);

  async function addBoxCallback() {
    props.setShowFields(false);
    const intDistance = values["distance"] as unknown as number;
    console.log(values);
    const newSegment: ISegment = {
      distance: intDistance,
      duration: intDistance,
      pace: intDistance,
    };
    props.setSegments((segments) => [...segments, newSegment]);
  }

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-md rounded px-8 py-6 mb-4"
      >
        <div>
          <label className="block text-gray-700 text-sm font-bold my-2">
            Distance Input
          </label>
          <input
            className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="alpaca-distance"
            placeholder="Distance in km"
            name="distance"
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
  segments: Array<ISegment>;
  setSegments: Dispatch<SetStateAction<Array<ISegment>>>;
}

export const FormCreator: React.FC<IFormProps> = ({
  showFields,
  setShowFields,
  segments,
  setSegments,
}: IFormProps) => {
  return (
    <div className="flex justify-center">
      {showFields ? (
        <Form
          setShowFields={setShowFields}
          segments={segments}
          setSegments={setSegments}
        />
      ) : (
        <div>
          <button
            type="submit"
            className="text-white bg-blue-700 font-medium rounded-lg text-sm text-center px-5 py-2.5 my-2"
            onClick={() => setShowFields(true)}
          >
            Add New
          </button>
        </div>
      )}
    </div>
  );
};

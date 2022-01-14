import React, {
  ChangeEventHandler,
  FormEventHandler,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { ISegment, getPace, getDistance, getDuration } from "./Box";

export const useForm = (
  callback: any,
  initialState: {
    distance: string | null;
    duration: string | null;
    pace: string | null;
  }
) => {
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

enum ConversionKind {
  ToPace,
  ToDistance,
  ToDuration,
}

interface IFormProps {
  segments: Array<ISegment>;
  setSegments: Dispatch<SetStateAction<Array<ISegment>>>;
}

export const Form: React.FC<IFormProps> = ({
  segments,
  setSegments,
}: IFormProps) => {
  const [step, setStep] = useState(0);
  const [conversionKind, setConversionKind] = useState<null | ConversionKind>(
    null
  );
  return (
    <div className="flex justify-center">
      {step === 0 ? (
        <AddNewButton setStep={setStep} />
      ) : step === 1 ? (
        <ConversionSelector
          setStep={setStep}
          setConversionKind={setConversionKind}
        />
      ) : (
        <ConversionInput
          setStep={setStep}
          segments={segments}
          setSegments={setSegments}
          conversionKind={
            conversionKind === null ? ConversionKind.ToDuration : conversionKind
          }
          setConversionKind={setConversionKind}
        />
      )}
    </div>
  );
};

export function AddNewButton(props: {
  setStep: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div>
      <button
        type="submit"
        className="text-white bg-blue-700 font-medium rounded-lg text-sm text-center px-5 py-2.5 my-2"
        onClick={() => props.setStep(1)}
      >
        Add New
      </button>
    </div>
  );
}

function ConversionButton(props: {
  conversionName: string;
  conversionKind: ConversionKind;
  setConversionKind: Dispatch<SetStateAction<ConversionKind | null>>;
  setStep: Dispatch<SetStateAction<number>>;
}) {
  return (
    <button
      type="submit"
      className="text-white bg-blue-700 font-medium rounded-lg text-sm text-center px-5 py-2.5 my-2"
      onClick={() => {
        props.setConversionKind(props.conversionKind);
        props.setStep(2);
      }}
    >
      {props.conversionName}
    </button>
  );
}

export function ConversionSelector(props: {
  setStep: Dispatch<SetStateAction<number>>;
  setConversionKind: Dispatch<SetStateAction<ConversionKind | null>>;
}) {
  return (
    <div>
      <ConversionButton
        conversionName={"Distance"}
        conversionKind={ConversionKind.ToDistance}
        setConversionKind={props.setConversionKind}
        setStep={props.setStep}
      />
      <ConversionButton
        conversionName={"Duration"}
        conversionKind={ConversionKind.ToDuration}
        setConversionKind={props.setConversionKind}
        setStep={props.setStep}
      />
      <ConversionButton
        conversionName={"Pace"}
        conversionKind={ConversionKind.ToPace}
        setConversionKind={props.setConversionKind}
        setStep={props.setStep}
      />
    </div>
  );
}

export function ConversionInputFormInput(props: {
  label: string;
  inputName: string;
  onChange: ChangeEventHandler<HTMLElement>;
}) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold my-2">
        {props.label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={`alpaca-${props.inputName}`}
        name={props.inputName}
        onChange={props.onChange}
        required
      />
    </div>
  );
}

export function ConversionInputForm(props: {
  labels: Array<string>;
  inputNames: Array<string>;
  onChange: ChangeEventHandler<HTMLElement>;
  onSubmit: FormEventHandler<HTMLElement>;
}) {
  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={props.onSubmit}
        className="bg-white shadow-md rounded px-8 py-6 mb-4"
      >
        <ConversionInputFormInput
          label={props.labels[0]}
          inputName={props.inputNames[0]}
          onChange={props.onChange}
        />
        <ConversionInputFormInput
          label={props.labels[1]}
          inputName={props.inputNames[1]}
          onChange={props.onChange}
        />
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

export function unreachable(state: never): never {
  throw new Error(`This state should be unreachable: ${state} `);
}

export function ConversionInput(props: {
  setStep: Dispatch<SetStateAction<number>>;
  segments: Array<ISegment>;
  setSegments: Dispatch<SetStateAction<Array<ISegment>>>;
  conversionKind: ConversionKind;
  setConversionKind: Dispatch<SetStateAction<ConversionKind | null>>;
}) {
  const initialState = { distance: null, duration: null, pace: null };
  const { onChange, onSubmit, values } = useForm(
    addSegmentCallback,
    initialState
  );

  async function addSegmentCallback() {
    const distance = values["distance"] as unknown as number;
    const duration = values["duration"] as unknown as number;
    const pace = values["pace"] as unknown as number;
    const newSegment =
      props.conversionKind === ConversionKind.ToPace
        ? getPace(distance, duration)
        : props.conversionKind === ConversionKind.ToDuration
        ? getDuration(pace, distance)
        : props.conversionKind === ConversionKind.ToDistance
        ? getDistance(pace, duration)
        : unreachable(props.conversionKind);

    props.setSegments((segments) => [...segments, newSegment]);
    props.setConversionKind(null);
    props.setStep(0);
  }

  return props.conversionKind === ConversionKind.ToPace ? (
    <ConversionInputForm
      labels={["Duration (in min)", "Distance (in km)"]}
      inputNames={["duration", "distance"]}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  ) : props.conversionKind === ConversionKind.ToDuration ? (
    <ConversionInputForm
      labels={["Pace (in min/km)", "Distance (in km)"]}
      inputNames={["pace", "distance"]}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  ) : props.conversionKind === ConversionKind.ToDistance ? (
    <ConversionInputForm
      labels={["Pace (in min/km)", "Duration (in min)"]}
      inputNames={["pace", "duration"]}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  ) : null;
}

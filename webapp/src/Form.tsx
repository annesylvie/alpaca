import React, {
  ChangeEventHandler,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {ISegment, getPace, getDistance, getDuration} from "./Segment";


enum ConversionKind {
  ToPace,
  ToDistance,
  ToDuration,
}

interface IFormProps {
  setSegments: Dispatch<SetStateAction<Array<ISegment>>>;
}

export const Form: React.FC<IFormProps> = ({setSegments}: IFormProps) => {
  const [step, setStep] = useState(0);
  return (
    <div className="flex justify-center">
      {step === 0 ? (
        <AddNewButton setStep={setStep} />
      ) : (
        <Convertor setStep={setStep} setSegments={setSegments} />
      )
      }
    </div>
  );
};

function AddNewButton(props: {
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


function ConversionInputFormInput(props: {
  label: string;
  inputName: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLElement>;
  disabled: boolean
}) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mt-2">
        {props.label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={`alpaca-${props.inputName}`}
        name={props.inputName}
        onChange={props.onChange}
        disabled={props.disabled}
        required
        placeholder={props.placeholder}
      />
    </div>
  );
}



function hmsToSeconds(input: string): number {
  let hmsSplit = input.split(':');
  let seconds = 0;
  let minutes = 1;

  while (hmsSplit.length > 0) {
    const nextHmsElement = hmsSplit.pop();
    if (nextHmsElement !== undefined) {
      seconds += minutes * parseInt(nextHmsElement, 10);
      minutes *= 60;
    }
  }

  return seconds;
}

function isSet(value: string | null): boolean {
  return value === null ? false : value.length > 0 ? true : false;
}

const useConvertor = (
  addSegmentCallback: any,
) => {
  const initialSegmentState = {distance: null, duration: null, pace: null};
  const [segment, setSegment] = useState(initialSegmentState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSegment({...segment, [event.target.name]: event.target.value});
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addSegmentCallback();
  };

  return {
    onChange,
    onSubmit,
    segment,
  };
};


function Convertor(props: {
  setSegments: Dispatch<SetStateAction<Array<ISegment>>>;
  setStep: Dispatch<SetStateAction<number>>;
}) {

  const {onChange, onSubmit, segment} = useConvertor(
    addSegmentCallback,
  );

  let disablePace, disableDistance, disableDuration;
  let conversionKind: ConversionKind | null;
  if (
    isSet(segment.pace) && isSet(segment.duration) && isSet(segment.distance)
  ) {
    console.log("Error, defaulting to converting to distance");
    disablePace = false; disableDistance = true; disableDuration = false;
    conversionKind = ConversionKind.ToDistance;
  }
  else if (isSet(segment.pace) && isSet(segment.distance)) {
    disablePace = false; disableDistance = false; disableDuration = true;
    conversionKind = ConversionKind.ToDuration;
  }
  else if (isSet(segment.pace) && isSet(segment.duration)) {
    disablePace = false; disableDistance = true; disableDuration = false;
    conversionKind = ConversionKind.ToDistance;
  }
  else if (isSet(segment.duration) && isSet(segment.distance)) {
    disablePace = true; disableDistance = false; disableDuration = false;
    conversionKind = ConversionKind.ToPace;
  }
  else {
    disablePace = false; disableDistance = false; disableDuration = false;
    conversionKind = null;
  }

  async function addSegmentCallback() {
    let newSegment: ISegment, pace, duration, distance;
    switch (conversionKind) {
      case ConversionKind.ToPace:
        distance = segment.distance === null ? 0 : parseFloat(segment.distance);
        duration = segment.duration === null ? 0 : hmsToSeconds(segment.duration);
        newSegment = getPace(distance, duration);
        break;
      case ConversionKind.ToDuration:
        distance = segment.distance === null ? 0 : parseFloat(segment.distance);
        pace = segment.pace === null ? 0 : hmsToSeconds(segment.pace);
        newSegment = getDuration(pace, distance);
        break;
      case ConversionKind.ToDistance:
        duration = segment.duration === null ? 0 : hmsToSeconds(segment.duration);
        pace = segment.pace === null ? 0 : hmsToSeconds(segment.pace);
        newSegment = getDistance(pace, duration);
        break;
      case null:
        throw new Error(`This state should be unreachable: ${conversionKind} `);
    }
    props.setSegments((segments) => [...segments, newSegment]);
    props.setStep(0);
  }

  return <div>
    <form
      onSubmit={onSubmit}
      className="bg-white shadow-md rounded px-8 py-6 mb-4"
    >
      <ConversionInputFormInput
        label="Pace"
        inputName="pace"
        onChange={onChange}
        disabled={disablePace}
        placeholder="hh:mm:ss (per km)"
      />
      <ConversionInputFormInput
        label="Duration"
        inputName="duration"
        onChange={onChange}
        disabled={disableDuration}
        placeholder="hh:mm:ss"
      />
      <ConversionInputFormInput
        label="Distance"
        inputName="distance"
        onChange={onChange}
        disabled={disableDistance}
        placeholder="km"
      />
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-2"
        >
          Submit
        </button>
        <button
          className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-2"
          onClick={() => {
            props.setStep(0);
          }}
        >
          Back
        </button>
      </div>
    </form>
  </div>

}


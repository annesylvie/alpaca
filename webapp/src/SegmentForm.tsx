import React, {
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {getPace, getDistance, getDuration, hmsToSeconds} from "./Utils/Conversion";
import {ISegment} from "./Utils/Interfaces";
import {InputLine, timeInputPattern, distanceInputPattern} from "./FormEntry";
import {SubmitButton} from "./Utils/Button";

enum ConversionKind {
  ToPace,
  ToDistance,
  ToDuration,
}

interface ISegmentFormProps {
  setSegments: Dispatch<SetStateAction<Array<ISegment>>>;
}

export const SegmentForm: React.FC<ISegmentFormProps> = ({setSegments}: ISegmentFormProps) => {
  const [step, setStep] = useState(0);
  return (
    <div>
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
    <div className="flex justify-center">
      <button
        type="submit"
        className="text-cream bg-blue-600 font-medium rounded-lg text-center px-5 py-2.5 my-2"
        onClick={() => props.setStep(1)}
      >
        Add New
      </button>
    </div>
  );
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

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="bg-blue-700 rounded px-8 py-6 mb-4 text-cream"
      >
        <InputLine
          inputTitle="Pace"
          inputName="pace"
          onChange={onChange}
          disabled={disablePace}
          placeholder="hh:mm:ss (per km)"
          pattern={timeInputPattern}
          tooltipContent="Placeholder zeros can be omitted. For instance, 4 minutes 9 seconds can be entered as 4:9 instead of 00:04:09."
        />
        <InputLine
          inputTitle="Duration"
          inputName="duration"
          onChange={onChange}
          disabled={disableDuration}
          placeholder="hh:mm:ss"
          pattern={timeInputPattern}
          tooltipContent="Placeholder zeros can be omitted. For instance, 4 minutes 9 seconds can be entered as 4:9 instead of 00:04:09."
        />
        <InputLine
          inputTitle="Distance"
          inputName="distance"
          onChange={onChange}
          disabled={disableDistance}
          placeholder="km"
          pattern={distanceInputPattern}
          tooltipContent="Distance in kilometers, e.g. 4 or 1.2"
        />
        <div className="flex items-center justify-between">
          <SubmitButton />
          <button
            className="text-cream bg-blue-500 font-medium rounded-lg px-5 py-2.5 text-center my-2"
            onClick={() => {
              props.setStep(0);
            }}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}


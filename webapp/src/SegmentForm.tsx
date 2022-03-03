import React, {
  useState,
  Dispatch,
  useEffect,
  Fragment,
  SetStateAction,
} from "react";
import {Transition, Listbox} from '@headlessui/react'
import {SelectorIcon} from '@heroicons/react/solid'
import Cookies from 'js-cookie'
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


function PaceDropdown(props: {
  setPace: Dispatch<SetStateAction<string | null>>,
  setIsDropdownActive: Dispatch<SetStateAction<boolean>>
  disabled: boolean,
}) {
  const rawPaces = Cookies.get("customPaces");
  const savedPaces = rawPaces === undefined ? [] : JSON.parse(rawPaces);
  const [selectedPace, setSelectedPace] = useState<
    {name: string, pace: string | null}
  >({
    pace: null, name: "Custom Paces"
  });

  const handleChange = (value: {pace: string | null, name: string}) => {
    setSelectedPace(value);
    if (value.pace !== null) {
      props.setPace(value.pace);
      props.setIsDropdownActive(true);
    }
  }
  return (
    savedPaces.length > 0 ?
      <div className="">
        <Listbox value={selectedPace} onChange={handleChange}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-blue-600 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
              <span className="block truncate">{selectedPace.name}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="w-5 h-5 text-cream"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-blue-600 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {savedPaces.map((pace: {name: string, pace: number}, paceIndex: number) => (
                  <Listbox.Option
                    key={paceIndex}
                    className={({active}) =>
                      `cursor-default select-none relative py-2 px-4 ${active ? 'bg-blue-500' : ''
                      }`
                    }
                    value={pace}
                    disabled={props.disabled}
                  >
                    {({selected}) => (
                      <span
                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                          }`}
                      >
                        {pace.name}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div> : null
  )
}


function PaceInput(props: {
  pace: string | null,
  setPace: Dispatch<SetStateAction<string | null>>,
  disabled: boolean,
  pattern: string,
}) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  return (
    <>
      <InputLine
        value={props.pace === null ? undefined : props.pace}
        setValue={props.setPace}
        inputTitle="Pace"
        inputName="pace"
        disabled={props.disabled || isDropdownActive}
        placeholder="hh:mm:ss (per km)"
        pattern={props.pattern}
        tooltipContent="Placeholder zeros can be omitted. For instance, 4 minutes 9 seconds can be entered as 4:9 instead of 00:04:09."
      />
      <PaceDropdown
        setPace={props.setPace}
        setIsDropdownActive={setIsDropdownActive}
        disabled={props.disabled}
      />
    </>
  )
}




function Convertor(props: {
  setSegments: Dispatch<SetStateAction<Array<ISegment>>>;
  setStep: Dispatch<SetStateAction<number>>;
}) {
  const [pace, setPace] = useState<string | null>(null);
  const [disablePace, setDisablePace] = useState(false);
  const [duration, setDuration] = useState<string | null>(null);
  const [disableDuration, setDisableDuration] = useState(false);
  const [distance, setDistance] = useState<string | null>(null);
  const [disableDistance, setDisableDistance] = useState(false);
  const [conversionKind, setConversionKind] = useState<ConversionKind | null>(null);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addSegmentCallback();
  };

  useEffect(() => {
    if (
      isSet(pace) && isSet(duration) && isSet(distance)
    ) {
      console.log("Error, defaulting to converting to distance");
      setDisablePace(false);
      setDisableDistance(true);
      setDisableDuration(false);
      setConversionKind(ConversionKind.ToDistance);
    }
    else if (isSet(pace) && isSet(distance)) {
      setDisablePace(false);
      setDisableDistance(false);
      setDisableDuration(true);
      setConversionKind(ConversionKind.ToDuration);
    }
    else if (isSet(pace) && isSet(duration)) {
      setDisablePace(false);
      setDisableDistance(true);
      setDisableDuration(false);
      setConversionKind(ConversionKind.ToDistance);
    }
    else if (isSet(duration) && isSet(distance)) {
      setDisablePace(true);
      setDisableDistance(false);
      setDisableDuration(false);
      setConversionKind(ConversionKind.ToPace);
    }
    else {
      setDisablePace(false);
      setDisableDistance(false);
      setDisableDuration(false);
      setConversionKind(null);
    }
  }, [pace, duration, distance]);

  async function addSegmentCallback() {
    let newSegment: ISegment;
    let segmentDistance, segmentDuration, segmentPace;
    switch (conversionKind) {
      case ConversionKind.ToPace:
        segmentDistance = distance === null ? 0 : parseFloat(distance);
        segmentDuration = duration === null ? 0 : hmsToSeconds(duration);
        newSegment = getPace(segmentDistance, segmentDuration);
        break;
      case ConversionKind.ToDuration:
        segmentDistance = distance === null ? 0 : parseFloat(distance);
        segmentPace = pace === null ? 0 : hmsToSeconds(pace);
        newSegment = getDuration(segmentPace, segmentDistance);
        break;
      case ConversionKind.ToDistance:
        segmentDuration = duration === null ? 0 : hmsToSeconds(duration);
        segmentPace = pace === null ? 0 : hmsToSeconds(pace);
        newSegment = getDistance(segmentPace, segmentDuration);
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
        <PaceInput
          pace={pace}
          setPace={setPace}
          disabled={disablePace}
          pattern={timeInputPattern}
        />
        <InputLine
          inputTitle="Duration"
          inputName="duration"
          setValue={setDuration}
          disabled={disableDuration}
          placeholder="hh:mm:ss"
          pattern={timeInputPattern}
          tooltipContent="Placeholder zeros can be omitted. For instance, 4 minutes 9 seconds can be entered as 4:9 instead of 00:04:09."
        />
        <InputLine
          inputTitle="Distance"
          inputName="distance"
          setValue={setDistance}
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


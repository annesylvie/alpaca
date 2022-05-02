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
import {SegmentData} from "./Utils/Interfaces";
import {paceTooltipText} from "./Utils/Tooltip";
import {InputLine, InputPace, timeInputPattern, distanceInputPattern} from "./FormEntry";
import {SubmitButton, BackButton, AddNewButton, ClearAllButton} from "./Utils/Button";

enum ConversionKind {
  ToPace,
  ToDistance,
  ToDuration,
}

interface SegmentFormProps {
  setSegments: Dispatch<SetStateAction<Array<SegmentData>>>;
}

export const SegmentForm: React.FC<SegmentFormProps> = ({setSegments}: SegmentFormProps) => {
  const [step, setStep] = useState(0);
  return (
    <div>
      {step === 0 ? (
        <div className="flex items-center justify-between px-8">
          <ClearAllButton setSegments={setSegments} />
          <AddNewButton setStep={setStep} />
        </div>
      ) : (
        <Convertor setStep={setStep} setSegments={setSegments} />
      )
      }
    </div>
  );
};



function isSet(value: string | null): boolean {
  return value === null ? false : value.length > 0 ? true : false;
}


function PaceDropdown(props: {
  setPaceHigh: Dispatch<SetStateAction<string | null>>,
  setPaceLow: Dispatch<SetStateAction<string | null>>,
  setIsDropdownActive: Dispatch<SetStateAction<boolean>>
  setInputPaceAsRange: Dispatch<SetStateAction<boolean>>
  disabled: boolean,
}) {
  const rawPaces = Cookies.get("customPaces");
  const savedPaces = rawPaces === undefined ? [] : JSON.parse(rawPaces);
  const [selectedPace, setSelectedPace] = useState<
    {name: string, paceHigh: string | null, paceLow: string | null}
  >({
    paceHigh: null, paceLow: null, name: "Custom Paces"
  });

  const handleChange = (value: {paceHigh: string | null, paceLow: string | null, name: string}) => {
    setSelectedPace(value);
    if (value.paceHigh !== null) {
      props.setPaceHigh(value.paceHigh);
      props.setPaceLow(value.paceLow);
      props.setIsDropdownActive(true);
      props.setInputPaceAsRange(value.paceHigh !== value.paceLow);
    }
  }
  return (
    savedPaces.length > 0 ?
      <div className="z-40">
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
  paceHigh: string | null,
  setPaceHigh: Dispatch<SetStateAction<string | null>>,
  paceLow: string | null,
  setPaceLow: Dispatch<SetStateAction<string | null>>,
  disabled: boolean,
}) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  // When paceHigh and paceLow are both not null and different: set as range
  const [inputPaceAsRange, setInputPaceAsRange] = useState(
    props.paceHigh !== null && props.paceLow !== null && props.paceHigh === props.paceLow
  );
  return (
    <>
      <InputPace
        paceHigh={props.paceHigh}
        setPaceHigh={props.setPaceHigh}
        paceLow={props.paceLow}
        setPaceLow={props.setPaceLow}
        inputPaceAsRange={inputPaceAsRange}
        setInputPaceAsRange={setInputPaceAsRange}
        disabled={props.disabled || isDropdownActive}
      />
      <PaceDropdown
        setPaceHigh={props.setPaceHigh}
        setPaceLow={props.setPaceLow}
        setIsDropdownActive={setIsDropdownActive}
        setInputPaceAsRange={setInputPaceAsRange}
        disabled={props.disabled}
      />
    </>
  )
}


function Convertor(props: {
  setSegments: Dispatch<SetStateAction<Array<SegmentData>>>;
  setStep: Dispatch<SetStateAction<number>>;
}) {
  const [paceHigh, setPaceHigh] = useState<string | null>(null);
  const [paceLow, setPaceLow] = useState<string | null>(null);
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
      (isSet(paceHigh) || isSet(paceLow)) && isSet(duration) && isSet(distance)
    ) {
      console.log("Error, defaulting to converting to distance");
      setDisablePace(false);
      setDisableDistance(true);
      setDisableDuration(false);
      setConversionKind(ConversionKind.ToDistance);
    }
    else if ((isSet(paceHigh) || isSet(paceLow)) && isSet(distance)) {
      setDisablePace(false);
      setDisableDistance(false);
      setDisableDuration(true);
      setConversionKind(ConversionKind.ToDuration);
    }
    else if ((isSet(paceHigh) || isSet(paceLow)) && isSet(duration)) {
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
  }, [paceHigh, paceLow, duration, distance]);

  async function addSegmentCallback() {
    let newSegment: SegmentData;
    let segmentDistance, segmentDuration, segmentPaceHigh, segmentPaceLow, segmentPaceRange;
    switch (conversionKind) {
      case ConversionKind.ToPace:
        segmentDistance = distance === null ? 0 : parseFloat(distance);
        segmentDuration = duration === null ? 0 : hmsToSeconds(duration);
        newSegment = getPace(segmentDistance, segmentDuration);
        break;
      case ConversionKind.ToDuration:
        segmentDistance = distance === null ? 0 : parseFloat(distance);
        segmentPaceHigh = paceHigh === null ? 0 : hmsToSeconds(paceHigh);
        segmentPaceLow = (paceLow === null || paceLow === "") ? segmentPaceHigh : hmsToSeconds(paceLow);
        segmentPaceRange = {high: segmentPaceHigh, low: segmentPaceLow}
        newSegment = getDuration(segmentPaceRange, segmentDistance);
        break;
      case ConversionKind.ToDistance:
        segmentDuration = duration === null ? 0 : hmsToSeconds(duration);
        segmentPaceHigh = paceHigh === null ? 0 : hmsToSeconds(paceHigh);
        segmentPaceLow = (paceLow === null || paceLow === "") ? segmentPaceHigh : hmsToSeconds(paceLow);
        segmentPaceRange = {high: segmentPaceHigh, low: segmentPaceLow}
        newSegment = getDistance(segmentPaceRange, segmentDuration);
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
          paceHigh={paceHigh}
          setPaceHigh={setPaceHigh}
          paceLow={paceLow}
          setPaceLow={setPaceLow}
          disabled={disablePace}
        />
        <InputLine
          inputTitle="Duration"
          inputName="duration"
          setValue={setDuration}
          disabled={disableDuration}
          placeholder="hh:mm:ss"
          pattern={timeInputPattern}
          tooltipContent={paceTooltipText}
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
          <BackButton setStep={props.setStep} />
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}


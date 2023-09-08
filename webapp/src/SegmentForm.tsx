import React, {
  useState,
  Dispatch,
  useEffect,
  Fragment,
  SetStateAction,
} from "react";
import { Transition, Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import {
  getPace,
  getDistance,
  getDuration,
  hmsToSeconds,
} from "./Utils/Conversion";
import { SegmentData } from "./Utils/Interfaces";
import { paceTooltipText } from "./Utils/Tooltip";
import {
  InputLine,
  InputPace,
  timeInputPattern,
  distanceInputPattern,
} from "./FormEntry";
import {
  IncrementButton,
  SubmitButton,
  BackButton,
  AddNewButton,
  ClearAllButton,
} from "./Utils/Button";

enum ConversionKind {
  ToPace,
  ToDistance,
  ToDuration,
}

interface SegmentFormProps {
  setSegments: Dispatch<SetStateAction<Array<SegmentData>>>;
}

export const SegmentForm: React.FC<SegmentFormProps> = ({
  setSegments,
}: SegmentFormProps) => {
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
      )}
    </div>
  );
};

function isSet(value: string | null): boolean {
  return value === null ? false : value.length > 0 ? true : false;
}

function SelectedDropdownEntry(props: { name: string }) {
  return (
    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-blue-600 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
      <span className="block truncate">{props.name}</span>
      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronUpDownIcon className="w-5 h-5 text-cream" aria-hidden="true" />
      </span>
    </Listbox.Button>
  );
}

function DropdownChoice(props: {
  name: string;
  index: number;
  value: any;
  disabled: boolean;
}) {
  return (
    <Listbox.Option
      key={props.index}
      className={({ active }) =>
        `cursor-default select-none relative py-2 px-4 ${
          active ? "bg-blue-500" : ""
        }`
      }
      value={props.value}
      disabled={props.disabled}
    >
      {({ selected }) => (
        <span
          className={`block truncate ${
            selected ? "font-medium" : "font-normal"
          }`}
        >
          {props.name}
        </span>
      )}
    </Listbox.Option>
  );
}

function PaceDropdown(props: {
  setPaceHigh: Dispatch<SetStateAction<string | null>>;
  setPaceLow: Dispatch<SetStateAction<string | null>>;
  setIsDropdownActive: Dispatch<SetStateAction<boolean>>;
  setInputPaceAsRange: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
}) {
  const rawPaces = Cookies.get("customPaces");
  const savedPaces = rawPaces === undefined ? [] : JSON.parse(rawPaces);
  const [selectedPace, setSelectedPace] = useState<{
    name: string;
    paceHigh: string | null;
    paceLow: string | null;
  }>({
    paceHigh: null,
    paceLow: null,
    name: "Custom Paces",
  });

  const handleChange = (value: {
    paceHigh: string | null;
    paceLow: string | null;
    name: string;
  }) => {
    setSelectedPace(value);
    if (value.paceHigh !== null) {
      props.setPaceHigh(value.paceHigh);
      props.setPaceLow(value.paceLow);
      props.setIsDropdownActive(true);
      props.setInputPaceAsRange(value.paceHigh !== value.paceLow);
    }
  };
  return savedPaces.length > 0 ? (
    <div className="z-40">
      <Listbox value={selectedPace} onChange={handleChange}>
        <div className="relative mt-1">
          <SelectedDropdownEntry name={selectedPace.name} />
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-blue-600 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {savedPaces.map(
                (pace: { name: string; pace: number }, paceIndex: number) => (
                  <DropdownChoice
                    name={pace.name}
                    value={pace}
                    index={paceIndex}
                    disabled={props.disabled}
                  />
                ),
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  ) : null;
}

function PaceInputOrDropdown(props: {
  paceHigh: string | null;
  setPaceHigh: Dispatch<SetStateAction<string | null>>;
  paceLow: string | null;
  setPaceLow: Dispatch<SetStateAction<string | null>>;
  disabled: boolean;
}) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  // When paceHigh and paceLow are both not null and different: set as range
  const [inputPaceAsRange, setInputPaceAsRange] = useState(
    props.paceHigh !== null &&
      props.paceLow !== null &&
      props.paceHigh === props.paceLow,
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
  );
}

function Dropdown(props: {
  dropdownTitle: string;
  dropdownValues: Array<{ name: string; value: string }>;
  setValue: Dispatch<SetStateAction<string | null>>;
  setIsDropdownActive: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
}) {
  const [selectedValue, setSelectedValue] = useState<{
    name: string;
    value: string | null;
  }>({
    name: props.dropdownTitle,
    value: null,
  });

  const handleChange = (selection: { name: string; value: string | null }) => {
    setSelectedValue(selection);
    if (selection.value !== null) {
      props.setValue(selection.value);
      props.setIsDropdownActive(true);
    }
  };
  return props.dropdownValues.length > 0 ? (
    <div className="z-40">
      <Listbox value={selectedValue} onChange={handleChange}>
        <div className="relative mt-1">
          <SelectedDropdownEntry name={selectedValue.name} />
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-blue-600 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {props.dropdownValues.map(
                (
                  dropdownValue: { name: string; value: string },
                  dropdownValueIndex: number,
                ) => (
                  <DropdownChoice
                    name={dropdownValue.name}
                    value={dropdownValue}
                    index={dropdownValueIndex}
                    disabled={props.disabled}
                  />
                ),
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  ) : null;
}

// Common durations
const _THIRTY_SECONDS = { name: "30s", value: "30" };
const _ONE_MINUTE = { name: "1 minute", value: "60" };
const _TWO_MINUTES = { name: "2 minutes", value: "120" };
const _FIVE_MINUTES = { name: "5 minutes", value: "300" };
const _FIFTEEN_MINUTES = { name: "15 minutes", value: "900" };
const _THIRTY_MINUTES = { name: "30 minutes", value: "1800" };
const _ONE_HOUR = { name: "1 hour", value: "3600" };
const _DURATIONS = [
  _THIRTY_SECONDS,
  _ONE_MINUTE,
  _TWO_MINUTES,
  _FIVE_MINUTES,
  _FIFTEEN_MINUTES,
  _THIRTY_MINUTES,
  _ONE_HOUR,
];
// Common distances
const _ONE_HUNDRED_METERS = { name: "100m", value: "0.1" };
const _TWO_HUNDRED_METERS = { name: "200m", value: "0.2" };
const _FOUR_HUNDRED_METERS = { name: "400m", value: "0.4" };
const _FIVE_HUNDRED_METERS = { name: "500m", value: "0.5" };
const _ONE_KILOMETER = { name: "1km", value: "1" };
const _FIVE_KILOMETERS = { name: "5k", value: "5" };
const _TEN_KILOMETERS = { name: "10k", value: "10" };
const _HALF = { name: "Half", value: "21.097" };
const _MARATHON = { name: "Marathon", value: "42.195" };
const _DISTANCES = [
  _ONE_HUNDRED_METERS,
  _TWO_HUNDRED_METERS,
  _FOUR_HUNDRED_METERS,
  _FIVE_HUNDRED_METERS,
  _ONE_KILOMETER,
  _FIVE_KILOMETERS,
  _TEN_KILOMETERS,
  _HALF,
  _MARATHON,
];

function InputOrDropdown(props: {
  value: string | null;
  setValue: Dispatch<SetStateAction<string | null>>;
  disabled: boolean;
  placeholder: string;
  inputTitle: string;
  inputName: string;
  dropdownTitle: string;
  dropdownValues: Array<{ name: string; value: string }>;
  pattern: string;
  tooltipContent: string | null;
}) {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  return (
    <>
      <InputLine
        value={props.value === null ? undefined : props.value}
        inputTitle={props.inputTitle}
        inputName={props.inputName}
        setValue={props.setValue}
        disabled={props.disabled || isDropdownActive}
        placeholder={props.placeholder}
        pattern={props.pattern}
        tooltipContent={props.tooltipContent}
      />
      <Dropdown
        dropdownTitle={props.dropdownTitle}
        dropdownValues={props.dropdownValues}
        setValue={props.setValue}
        setIsDropdownActive={setIsDropdownActive}
        disabled={props.disabled}
      />
    </>
  );
}

function RepetitionCounter(props: {
  repeat: number;
  setRepeat: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="flex items-center py-3">
      <span className="pr-2">{`Repetitions: ${props.repeat}`}</span>
      <IncrementButton
        data={props.repeat}
        setData={props.setRepeat}
        incrementValue={-1}
        disabled={props.repeat <= 1}
      />
      <IncrementButton
        data={props.repeat}
        setData={props.setRepeat}
        incrementValue={1}
        disabled={props.repeat >= 50}
      />
    </div>
  );
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
  const [conversionKind, setConversionKind] = useState<ConversionKind | null>(
    null,
  );
  const [repeat, setRepeat] = useState<number>(1);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addSegmentCallback();
  };

  useEffect(() => {
    if (
      (isSet(paceHigh) || isSet(paceLow)) &&
      isSet(duration) &&
      isSet(distance)
    ) {
      console.log("Error, defaulting to converting to distance");
      setDisablePace(false);
      setDisableDistance(true);
      setDisableDuration(false);
      setConversionKind(ConversionKind.ToDistance);
    } else if ((isSet(paceHigh) || isSet(paceLow)) && isSet(distance)) {
      setDisablePace(false);
      setDisableDistance(false);
      setDisableDuration(true);
      setConversionKind(ConversionKind.ToDuration);
    } else if ((isSet(paceHigh) || isSet(paceLow)) && isSet(duration)) {
      setDisablePace(false);
      setDisableDistance(true);
      setDisableDuration(false);
      setConversionKind(ConversionKind.ToDistance);
    } else if (isSet(duration) && isSet(distance)) {
      setDisablePace(true);
      setDisableDistance(false);
      setDisableDuration(false);
      setConversionKind(ConversionKind.ToPace);
    } else {
      setDisablePace(false);
      setDisableDistance(false);
      setDisableDuration(false);
      setConversionKind(null);
    }
  }, [paceHigh, paceLow, duration, distance]);

  async function addSegmentCallback() {
    let newSegment: SegmentData;
    let segmentDistance,
      segmentDuration,
      segmentPaceHigh,
      segmentPaceLow,
      segmentPaceRange;
    switch (conversionKind) {
      case ConversionKind.ToPace:
        segmentDistance = distance === null ? 0 : parseFloat(distance);
        segmentDuration = duration === null ? 0 : hmsToSeconds(duration);
        newSegment = getPace(segmentDistance, segmentDuration, repeat);
        break;
      case ConversionKind.ToDuration:
        segmentDistance = distance === null ? 0 : parseFloat(distance);
        segmentPaceHigh = paceHigh === null ? 0 : hmsToSeconds(paceHigh);
        segmentPaceLow =
          paceLow === null || paceLow === ""
            ? segmentPaceHigh
            : hmsToSeconds(paceLow);
        segmentPaceRange = { high: segmentPaceHigh, low: segmentPaceLow };
        newSegment = getDuration(segmentPaceRange, segmentDistance, repeat);
        break;
      case ConversionKind.ToDistance:
        segmentDuration = duration === null ? 0 : hmsToSeconds(duration);
        segmentPaceHigh = paceHigh === null ? 0 : hmsToSeconds(paceHigh);
        segmentPaceLow =
          paceLow === null || paceLow === ""
            ? segmentPaceHigh
            : hmsToSeconds(paceLow);
        segmentPaceRange = { high: segmentPaceHigh, low: segmentPaceLow };
        newSegment = getDistance(segmentPaceRange, segmentDuration, repeat);
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
        <PaceInputOrDropdown
          paceHigh={paceHigh}
          setPaceHigh={setPaceHigh}
          paceLow={paceLow}
          setPaceLow={setPaceLow}
          disabled={disablePace}
        />
        <InputOrDropdown
          value={duration}
          inputTitle="Duration"
          inputName="duration"
          setValue={setDuration}
          disabled={disableDuration}
          placeholder="hh:mm:ss"
          pattern={timeInputPattern}
          tooltipContent={paceTooltipText}
          dropdownTitle="Common durations"
          dropdownValues={_DURATIONS}
        />
        <InputOrDropdown
          value={distance}
          inputTitle="Distance"
          inputName="distance"
          setValue={setDistance}
          disabled={disableDistance}
          placeholder="km"
          pattern={distanceInputPattern}
          tooltipContent="Distance in kilometers, e.g. 4 or 1.2"
          dropdownTitle="Common distances"
          dropdownValues={_DISTANCES}
        />
        <RepetitionCounter repeat={repeat} setRepeat={setRepeat} />
        <div className="flex items-center justify-between">
          <BackButton setStep={props.setStep} />
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

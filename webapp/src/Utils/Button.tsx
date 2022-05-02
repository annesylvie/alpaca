import {MinusSmIcon, PlusSmIcon} from '@heroicons/react/solid'
import {Dispatch, SetStateAction, } from "react";
import {SegmentData} from "./Interfaces";
import {classNames} from "./Css";

export function SubmitButton() {
  return <button
    type="submit"
    className="text-blue-500 bg-cream font-medium rounded-lg px-5 py-2.5 text-center my-2"
  >
    Submit
  </button>
}

export function BackButton(
  props: {
    setStep: Dispatch<SetStateAction<number>>;
  }
) {
  return <button
    className="text-cream bg-blue-500 font-medium rounded-lg px-5 py-2.5 text-center my-2"
    onClick={() => {
      props.setStep(0);
    }}
  >
    Back
  </button>
}

export function AddNewButton(props: {
  setStep: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="flex justify-center">
      <button
        type="submit"
        className="text-blue-600 bg-cream font-medium rounded-lg text-center px-5 py-2.5 my-2"
        onClick={() => props.setStep(1)}
      >
        Add New
      </button>
    </div>
  );
}

export function ClearAllButton(props: {
  setSegments: Dispatch<SetStateAction<Array<SegmentData>>>;
}) {
  return (
    <div className="flex justify-center">
      <button
        type="submit"
        className="text-cream bg-blue-600 font-medium rounded-lg text-center px-5 py-2.5 my-2"
        onClick={() => props.setSegments([])}
      >
        Clear
      </button>
    </div>
  );
}


export function IncrementButton(props: {
  data: number,
  setData: Dispatch<SetStateAction<number>>
  incrementValue: number,
  disabled: boolean
}) {
  return <button
    type="button"
    className={classNames(
      props.disabled ? "bg-blue-600 opacity 30" : "bg-blue-500",
      "text-cream font-medium rounded-lg px-2 text-center py-1 mx-0.5")}
    onClick={() => {props.setData(props.data + props.incrementValue)}}
    disabled={props.disabled}
  >
    {props.incrementValue > 0
      ? <PlusSmIcon className="h-4 w-4 text-cream" aria-hidden="true" />
      : <MinusSmIcon className="h-4 w-4 text-cream" aria-hidden="true" />
    }
  </button >
}

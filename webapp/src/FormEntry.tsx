import React, {Dispatch, SetStateAction} from "react";
import {QuestionMarkCircleIcon} from '@heroicons/react/solid';
import {classNames} from "./Utils/Css";
import {Switch} from '@headlessui/react'
import {paceTooltipText} from "./Utils/Tooltip";
import {colonBasedTimeInputPattern, wordBasedTimeInputPattern} from "./Utils/Conversion";

export let timeInputPattern = `(?:${colonBasedTimeInputPattern})|(?:${wordBasedTimeInputPattern})`;
export let distanceInputPattern = "\\d+.?\\d*";


export function InputLine(props: {
  value: string;
  inputTitle: string;
  inputName: string;
  placeholder: string;
  setValue: Dispatch<SetStateAction<string>>,
  disabled: boolean
  pattern: string;
  tooltipContent: string | null;
}) {
  return (
    <div>
      {props.tooltipContent !== null ?
        <label className="block mt-2">
          <div className="flex justify-between items-center">
            <div className="pl-2 font-bold"> {props.inputTitle} </div>
            <div className="group pr-2">
              <p>
                <QuestionMarkCircleIcon className="h-4 w-4" aria-hidden="true" />
                <span className="tooltip-text max-w-[13rem] bg-blue-500 text-sm rounded hidden group-hover:block absolute text-center py-2 px-6 z-50">
                  {props.tooltipContent}
                </span>
              </p>
            </div>
          </div>
        </label> : null}
      <input
        className={classNames(
          props.disabled ? "bg-blue-700 opacity-30" : "bg-blue-600",
          "shadow appearance-none border rounded w-full my-2 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
        )}
        id={`alpaca-${props.inputName}`}
        name={props.inputName}
        onChange={event => props.setValue(event.target.value)}
        disabled={props.disabled}
        required
        placeholder={props.placeholder}
        pattern={props.pattern}
        value={props.value}
        autoComplete="off"
      />
    </div>
  );
}


export function AverageRangeSwitch(props: {
  enabled: boolean,
  setEnabled: Dispatch<SetStateAction<boolean>>,
  disabled: boolean
}) {
  return <div className={`${props.disabled ? "opacity-30" : ""} flex items-center justify-end text-sm`} >
    <span className="mr-2">
      Define pace as:
    </span>
    <span className="mr-2">
      Average
    </span>
    <Switch
      checked={props.enabled}
      disabled={props.disabled}
      onChange={props.setEnabled}
      className={`bg-blue-500 relative inline-flex flex-shrink-0 h-4 w-8 border-1 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-blue-500 focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${props.enabled ? 'translate-x-[18px]' : 'translate-x-0.5'} translate-y-0.5
            pointer-events-none inline-block h-3 w-3 rounded-full bg-cream shadow-lg transform ring-0 transition ease-in-out duration-200`}
      />
    </Switch>
    <span className="ml-2">
      Range
    </span>
  </div >

}


export function InputPace(props: {
  paceHigh: string;
  setPaceHigh: Dispatch<SetStateAction<string>>,
  paceLow: string;
  setPaceLow: Dispatch<SetStateAction<string>>,
  inputPaceAsRange: boolean,
  setInputPaceAsRange: Dispatch<SetStateAction<boolean>>,
  disabled: boolean
}) {
  return <>
    <AverageRangeSwitch
      enabled={props.inputPaceAsRange}
      setEnabled={props.setInputPaceAsRange}
      disabled={props.disabled}
    />
    <InputLine
      value={props.paceHigh}
      setValue={props.setPaceHigh}
      inputTitle={props.inputPaceAsRange ? "Pace Range: From - To" : "Average Pace"}
      inputName="pace"
      disabled={props.disabled}
      placeholder={`hh:mm:ss (per km)${props.inputPaceAsRange ? " - fast" : ""}`}
      pattern={timeInputPattern}
      tooltipContent={paceTooltipText}
    />
    {
      props.inputPaceAsRange ?
        <InputLine
          value={props.paceLow}
          setValue={props.setPaceLow}
          inputTitle="Pace"
          inputName="pace"
          disabled={props.disabled}
          placeholder="hh:mm:ss (per km) - slow"
          pattern={timeInputPattern}
          tooltipContent={null}
        />
        : null
    }
  </>
}

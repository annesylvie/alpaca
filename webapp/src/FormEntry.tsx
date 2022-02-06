import React, {ChangeEventHandler} from "react";
import {QuestionMarkCircleIcon} from '@heroicons/react/solid'

export let timeInputPattern = "^\\d*:?\\d*:?\\d+$";
export let distanceInputPattern = "\\d+.?\\d*";

export function InputLine(props: {
  inputTitle: string;
  inputName: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLElement>;
  disabled: boolean
  pattern: string;
  tooltipContent: string;
}) {
  return (
    <div>
      <label className="block mt-2">
        <div className="flex justify-between items-center">
          <div className="pl-2 font-bold"> {props.inputTitle} </div>
          <div className="group pr-2">
            <p>
              <QuestionMarkCircleIcon className="h-4 w-4" aria-hidden="true" />
              <span className="tooltip-text max-w-[13rem] bg-blue-500 text-sm rounded hidden group-hover:block absolute text-center py-2 px-6 z-50&quot;">
                {props.tooltipContent}
              </span>
            </p>
          </div>
        </div>
      </label>
      <input
        className="shadow appearance-none border rounded w-full my-2 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-blue-600"
        id={`alpaca-${props.inputName}`}
        name={props.inputName}
        onChange={props.onChange}
        disabled={props.disabled}
        required
        placeholder={props.placeholder}
        pattern={props.pattern}
      />
    </div>
  );
}

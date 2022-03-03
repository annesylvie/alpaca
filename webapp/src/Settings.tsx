import {TrashIcon} from '@heroicons/react/solid'
import Cookies from 'js-cookie'
import React, {
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {InputLine, timeInputPattern} from "./FormEntry";
import {SubmitButton} from "./Utils/Button";

export function Settings() {
  return <div className="flex justify-center">
    <div className="bg-blue-700 w-4/5 max-w-lg rounded-lg mx-2 my-10 p-4 text-cream">
      <div className="p-2">
        <div className="text-xl font-bold pb-6">
          Settings
        </div>
        <div className="pb-4">
          <CustomPaces />
        </div>
      </div>
    </div>
  </div>
}

interface IPace {
  name: string,
  pace: string
}

function CustomPaceBox(
  props: {
    pace: IPace;
    setPaces: Dispatch<SetStateAction<Array<IPace>>>
  }
) {
  return (
    <div className="flex text-cream bg-blue-500 font-medium rounded-lg px-5 py-2.5 text-center my-2 justify-between content-center"
    >
      <div className="font-semibold">{props.pace.name}</div>
      <div>{props.pace.pace}</div>
      <button type="button" onClick={() => {
        props.setPaces(prevPaces => (
          prevPaces.filter((pace) => pace.name !== props.pace.name)
        ));
      }
      }>
        <TrashIcon className="h-4 w-4 text-cream" aria-hidden="true" />
      </button>
    </div >
  )
}

export function CustomPaces() {
  const rawPaces = Cookies.get("customPaces");
  const savedPaces = rawPaces === undefined ? [] : JSON.parse(rawPaces);
  const [paces, setPaces] = useState<Array<IPace>>(savedPaces);
  const existingPaceNames = new Set(paces.map((pace) => pace.name));

  Cookies.set("customPaces", JSON.stringify(paces), {expires: 365});

  return (
    <div>
      Define your own paces
      <CustomPacesForm setPaces={setPaces} existingPaceNames={existingPaceNames} />
      <div className="py-2" />
      Your custom paces:
      {
        paces.length > 0 ?
          paces.map((pace) => <CustomPaceBox pace={pace} setPaces={setPaces} />)
          : <div>No custom paces saved yet</div>
      }
    </div >
  )
}



export function CustomPacesForm(
  props: {
    setPaces: Dispatch<SetStateAction<Array<IPace>>>
    existingPaceNames: Set<string>
  }
) {
  //const {onChange, onSubmit, customPace} = useForm(addCustomPaceCallback);
  const [paceName, setPaceName] = useState<string | null>(null);
  const [paceValue, setPaceValue] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addCustomPaceCallback();
  };

  async function addCustomPaceCallback() {

    if (paceName === null || paceName.length === 0 || paceValue === null || paceValue.length === 0) {
      alert("The name or value of the custom pace should not be empty")

    }
    const newPace = {name: paceName!, pace: paceValue!} as IPace;
    if (newPace.name.length > 32) {
      alert("Maximum 32 characters. Please choose a shorter name.")

    }
    else if (props.existingPaceNames.has(newPace.name)) {
      alert("A custom pace with the same name already exists - please choose another name.");
    }
    else {
      props.setPaces((paces) => [...paces, newPace]);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <InputLine
          value={paceName === null ? undefined : paceName}
          inputTitle="Name"
          inputName="name"
          setValue={setPaceName}
          disabled={false}
          placeholder="Name of your custom pace"
          pattern={"^[\\w /:-.(),@]+$"}
          tooltipContent="Valid characters for name are letters, numbers, and some basic punctuations. Max 32 characters."
        />
        <InputLine
          value={paceValue === null ? undefined : paceValue}
          inputTitle="Pace"
          inputName="pace"
          setValue={setPaceValue}
          disabled={false}
          placeholder="hh:mm:ss (per km)"
          pattern={timeInputPattern}
          tooltipContent="Placeholder zeros can be omitted. For instance, 4 minutes 9 seconds can be entered as 4:9 instead of 00:04:09."
        />
        <SubmitButton />
      </form>
    </div>
  );
}

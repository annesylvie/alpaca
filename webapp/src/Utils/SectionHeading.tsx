import {XIcon} from '@heroicons/react/solid'
import {Link} from "react-router-dom";

export function SectionHeading(props: {sectionName: string}) {
  return <div className="flex justify-between items-center text-xl font-bold pb-6">
    {props.sectionName}
    <Link to="/">
      <button type="button" className="flex rounded-lg items-center">
        <XIcon className="h-4 w-4 text-cream" aria-hidden="true" />
      </button>
    </Link>
  </div>

}

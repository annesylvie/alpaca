import { QuestionMarkCircleIcon, Cog8ToothIcon } from '@heroicons/react/24/solid'
import { ReactComponent as Logo } from './Assets/logo.svg';
import { Link } from "react-router-dom";

export function TopBanner() {
  return (
    <div className="bg-blue-700">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <Link to="/">
              <button type="button" className="flex rounded-lg items-center">
                <Logo className="h-14 w-14 text-cream" aria-hidden="true" />
                <p className="ml-2 text-xl font-bold text-cream truncate">
                  <span className="hidden md:inline">Alpaca</span>
                </p>
              </button>
            </Link>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <Link to="/about">
              <button
                type="button"
                className="-mr-1 flex p-2"
              >
                <QuestionMarkCircleIcon className="h-6 w-6 text-cream" aria-hidden="true" />
              </button>
            </Link>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <Link to="/settings">
              <button
                type="button"
                className="-mr-1 flex p-2"
              >
                <Cog8ToothIcon className="h-6 w-6 text-cream" aria-hidden="true" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

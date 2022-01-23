import {QuestionMarkCircleIcon, FireIcon} from '@heroicons/react/solid'

export function TopBanner() {
  return (
    <div className="bg-blue-700">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <button type="button" className="flex p-2 rounded-lg">
              <FireIcon className="h-6 w-6 text-cream" aria-hidden="true" />
            </button>
            <p className="ml-3 text-xl font-bold text-cream truncate">
              <span className="hidden md:inline">Alpaca</span>
            </p>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              className="-mr-1 flex p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cream sm:-mr-2"
            >
              <span className="sr-only">Dismiss</span>
              <QuestionMarkCircleIcon className="h-6 w-6 text-cream" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

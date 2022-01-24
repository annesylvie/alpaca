export function About() {
  return <div className="flex justify-center">
    <div className="bg-blue-700 w-3/5 max-w-lg rounded-lg mx-2 my-10 p-4 text-cream">
      <div className="p-2">
        <div className="text-xl font-bold pb-6">
          About
        </div>
        <div className="pb-4">
          This app is meant to help people easily plan their runs.
        </div>
        <div className="pb-4">
          If you follow a running program, or get your workouts from a coach, chances are that
          that your sessions are made of a succession of parts, each with their specificities.
        </div>
        <div className="pb-4">
          For instance, the workout might start with 10 minutes of warm-up, followed by 1km at 5k pace, then 2 minutes recovery, etc.
        </div>
        <div className="pb-4">
          It can therefore be difficult to know for how long and how far one will be running.
        </div>
        <div className="pb-4">
          This little app solves this issue by letting you add segments for each of your run's parts.
          Just fill in two of the three inputs - the last one will be computed
          automatically - and you will get a tally of all of your segments, showing you
          the total duration and distance covered in that run.
        </div>
        <div className="pb-4">
          That's it! Happy running!
        </div>
      </div>
    </div>
  </div>
}

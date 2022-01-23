import "./App.css";
import {SegmentsPage} from "./SegmentsPage"
import {TopBanner} from "./TopBanner"

function App() {
  return (
    <div className="bg-blue-800 h-screen">
      <TopBanner />
      <SegmentsPage />
    </div>
  );
}

export default App;

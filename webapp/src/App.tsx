import "./App.css";
import {SegmentsPage} from "./SegmentsPage";
import {TopBanner} from "./TopBanner";
import {About} from "./About";
import {
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="bg-blue-800 h-screen">
      <TopBanner />
      <Routes>
        <Route path="/" element={<SegmentsPage />} />
        <Route path="about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;

import "./App.css";
import {SegmentsPage} from "./SegmentsPage";
import {TopBanner} from "./TopBanner";
import {About} from "./About";
import {Settings} from "./Settings";
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
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;

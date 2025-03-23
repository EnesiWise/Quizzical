import HomePage from "./components/HomePage";
import QuizPage from "./components/QuizPage";
import blobUp from "./images/blobUp.png";
import blobDown from "./images/blobDown.png";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div>
      <img className="blob-up" src={blobUp} alt="yellow-blob" />

      <Router basename="/Quizzical">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="Quiz" element={<QuizPage />}></Route>
        </Routes>
      </Router>

      <img className="blob-down" src={blobDown} alt="blue-blob" />
    </div>
  );
}

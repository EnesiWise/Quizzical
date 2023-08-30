//import { useState } from "react";
import HomePage from "./components/HomePage";
import QuizPage from "./components/QuizPage";
import blobUp from "./images/blobUp.png";
import blobDown from "./images/blobDown.png";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div>
      <img className="blob-up" src={blobUp} alt="yellow-blob" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="Quiz" element={<QuizPage />}></Route>
        </Routes>
      </BrowserRouter>
      <img className="blob-down" src={blobDown} alt="blue-blob" />
    </div>
  );
}

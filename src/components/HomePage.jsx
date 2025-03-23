import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="homepage-container">
      <h2 className="header">Quizzical</h2>
      <p className="description">Test yourself with these questions</p>
      <Link to="/Quiz">
        <button className="start-btn">Start Quiz</button>
      </Link>
    </div>
  );
}

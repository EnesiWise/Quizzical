import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SingleQuestion from "./SingleQuestion";
import { PropagateLoader } from "react-spinners";

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [numCorrectAnswers, setNumCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://opentdb.com/api.php?amount=5&category=18&difficulty=medium"
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      console.log(data); // Debugging: Log API response
      setQuestions(data.results);

      setQuestionsAndAnswers(
        data.results.map((questionObject) => {
          return {
            question: questionObject.question,
            shuffledAnswers: shuffle([
              ...questionObject.incorrect_answers,
              questionObject.correct_answer,
            ]),
            correctAnswer: questionObject.correct_answer,
            selectedAnswer: "",
          };
        })
      );
      console.log(questionsAndAnswers); // Debugging: Log questionsAndAnswers
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Too many requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  function updateAnswer(currentQuestion, answer) {
    setQuestionsAndAnswers(
      questionsAndAnswers.map((questionObject) => {
        return questionObject.question === currentQuestion
          ? { ...questionObject, selectedAnswer: answer }
          : questionObject;
      })
    );
  }

  function checkAnswer() {
    const notAllAnswered = questionsAndAnswers.some(
      (questionObject) => questionObject.selectedAnswer === ""
    );
    setShowWarning(notAllAnswered);
    if (!notAllAnswered) {
      questionsAndAnswers.forEach((questionObject) => {
        if (questionObject.selectedAnswer === questionObject.correctAnswer) {
          setNumCorrectAnswers(
            (prevNumCorrectAnswers) => prevNumCorrectAnswers + 1
          );
        }
      });
      setShowResult(true);
    }
  }

  function playAgain() {
    setQuestions([]);
    setQuestionsAndAnswers([]);
    setShowResult(false);
    setNumCorrectAnswers(0);
    fetchData(); // Fetch new questions
  }

  const questionElements =
    questionsAndAnswers.length > 0 ? (
      questionsAndAnswers.map((questionObject, index) => {
        return (
          <SingleQuestion
            key={index}
            question={questionObject.question}
            allAnswers={questionObject.shuffledAnswers}
            selectedAnswer={questionObject.selectedAnswer}
            correctAnswer={questionObject.correctAnswer}
            showResult={showResult}
            updateAnswer={updateAnswer}
          />
        );
      })
    ) : (
      <p>No questions available. Please try again later.</p>
    ); // Fallback UI

  return (
    <>
      <Link to="/" className="back-link">
        <button className="back-btn">&larr;</button>
      </Link>

      {loading ? (
        <PropagateLoader color="#4d5b9e" loading={loading} size={10} />
      ) : error ? (
        <div>
          <p>{error}</p>
          <button onClick={fetchData} className="retryBtn">
            Retry
          </button>
        </div>
      ) : (
        <div>
          <div className="questions-container">{questionElements}</div>

          <div className="text-center">
            {showWarning && (
              <p className="warning-message">
                There are questions not answered yet
              </p>
            )}
            {questions.length > 0 && !showResult ? (
              <button className="check-btn" onClick={checkAnswer}>
                Check answers
              </button>
            ) : null}
          </div>

          {showResult && (
            <div className="result-container">
              <p className="result-message">
                You scored {numCorrectAnswers}/5 correct answers
              </p>
              <button className="play-again-btn" onClick={playAgain}>
                Play again
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default QuizPage;

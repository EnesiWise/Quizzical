import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SingleQuestion from "./SingleQuestion";
import BeatLoader from "react-spinners/BeatLoader";

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [numCorrectAnswers, setNumCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);

  //useState  & useEffect for page loader : BeatLoader
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const res = await fetch(
        "https://opentdb.com/api.php?amount=5&category=18&difficulty=medium"
      );
      //This variable "const json =" was used to store the "await res.json" line below
      await res.json();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (questions.length === 0) {
      fetch(
        "https://opentdb.com/api.php?amount=5&category=18&difficulty=medium"
      )
        .then((response) => response.json())
        .then((data) => {
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
        });
    }
  }, [questions]);

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
  }

  const questionElements = questionsAndAnswers.map((questionObject, index) => {
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
  });
  return (
    <>
      <Link to="/" className="back-link">
        <button className="back-btn">&larr;</button>
      </Link>

      {loading ? (
        <BeatLoader
          color={"#4d5b9e"}
          loading={loading}
          size={10}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div>
          <div className="questions-container">{questionElements}</div>

          <div className="text-center">
            {showWarning && (
              <p className="warning-message">
                there are questions not answered yet
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
                You scored{numCorrectAnswers}/5 correct answers
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

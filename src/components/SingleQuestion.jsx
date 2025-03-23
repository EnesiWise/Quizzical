import React from "react";
import { decode } from "html-entities";

export default function SingleQuestion(props) {
  function clickAnswer(answer, currentQuestion) {
    props.updateAnswer(currentQuestion, answer);
  }

  const answerElement = props.allAnswers.map((answer, index) => {
    return (
      <button
        key={index}
        onClick={() => clickAnswer(answer, props.question)}
        className={`answer-btn ${
          answer === props.selectedAnswer ? "selected" : ""
        }
        ${props.showResult && answer === props.correctAnswer ? "correct" : ""}
        ${
          props.showResult &&
          answer === props.selectedAnswer &&
          answer !== props.correctAnswer
            ? "incorrect"
            : ""
        }
        ${props.showResult && answer !== props.correctAnswer ? "dimmed" : ""}`}
        disabled={props.showResult}
      >
        {decode(answer)}
      </button>
    );
  });

  return (
    <div className="single-question-container">
      <h2 className="single-question">{decode(props.question)}</h2>
      <div className="answers-btn-container">{answerElement}</div>
    </div>
  );
}

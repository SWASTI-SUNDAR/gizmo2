import React, { useState, useEffect } from "react";

const QuizComponent = ({
  title = "Quiz",
  questions = [],
  onComplete = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Initialize the answers array based on the number of questions
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(null));
    }
  }, [questions]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedOption(null);
    setSubmitted(false);
  };

  const handleOptionSelect = (index) => {
    if (!submitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers];
      const isCorrect =
        selectedOption === questions[currentQuestion].correctAnswer;
      newAnswers[currentQuestion] = isCorrect;
      setAnswers(newAnswers);
      setSubmitted(true);

      // Move to next question after a short delay
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedOption(null);
          setSubmitted(false);
        } else {
          // Last question completed, pass results to parent and close
          setCompleted(true);
          onComplete(newAnswers);
          setTimeout(() => {
            handleClose();
          }, 1000);
        }
      }, 1000);
    }
  };

  const openQuestion = (index) => {
    if (answers[index] !== null || index <= Math.max(currentQuestion, 0)) {
      setCurrentQuestion(index);
      setSelectedOption(null);
      setSubmitted(false);
      setIsOpen(true);
    }
  };

  const getButtonColor = (index) => {
    if (answers[index] === null) {
      return index === currentQuestion && isOpen
        ? "bg-blue-500 text-white"
        : "bg-gray-200";
    }
    return answers[index] ? "bg-green-500 text-white" : "bg-red-500 text-white";
  };

  const getButtonSize = (index) => {
    return index === currentQuestion && isOpen
      ? "w-14 h-14 -translate-y-1"
      : "w-12 h-12";
  };

  return (
    <>
      {/* Outside question indicators */}
      <div className="absolute bottom-36 right-0 flex gap-2 z-10">
        {questions.map((_, index) => (
          <button
            key={index}
            className={`${getButtonSize(
              index
            )} rounded-lg text-center shadow-md transform transition-all duration-200 ${getButtonColor(
              index
            )}`}
            onClick={() => openQuestion(index)}
          >
            Q{index + 1}
          </button>
        ))}
      </div>

      {/* Quiz modal dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-screen overflow-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={handleClose}
                aria-label="Close quiz"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white rounded px-4 py-2">
                  Question {currentQuestion + 1}
                </div>
                <div className="h-1 flex-grow bg-gray-200 ml-4">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${
                        ((currentQuestion + 1) / questions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-6">
                {questions[currentQuestion].text}
              </h3>

              <div className="space-y-4 mb-6">
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                        selectedOption === index
                          ? submitted
                            ? index === questions[currentQuestion].correctAnswer
                              ? "border-green-500 bg-green-100"
                              : "border-red-500 bg-red-100"
                            : "border-blue-500 bg-blue-100"
                          : "border-gray-300"
                      }`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      {selectedOption === index && (
                        <div
                          className={`w-3 h-3 rounded-full ${
                            submitted
                              ? index ===
                                questions[currentQuestion].correctAnswer
                                ? "bg-green-500"
                                : "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        ></div>
                      )}
                    </div>
                    <label
                      className={`ml-2 block cursor-pointer ${
                        submitted &&
                        index === questions[currentQuestion].correctAnswer
                          ? "text-green-600 font-medium"
                          : ""
                      }`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      {option}
                    </label>
                    {submitted &&
                      index === questions[currentQuestion].correctAnswer && (
                        <svg
                          className="w-5 h-5 ml-2 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-lg text-white font-medium ${
                  selectedOption === null || submitted
                    ? "bg-purple-300 cursor-not-allowed"
                    : "bg-purple-500 hover:bg-purple-600"
                }`}
                onClick={handleSubmit}
                disabled={selectedOption === null || submitted}
              >
                {currentQuestion === questions.length - 1 ? "Finish" : "Submit"}
              </button>

              {completed && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-800">
                    Quiz completed! You got{" "}
                    {answers.filter((a) => a === true).length} out of{" "}
                    {questions.length} correct.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`w-12 h-12 rounded-lg text-center ${getButtonColor(
                    index
                  )}`}
                  onClick={() => {
                    if (answers[index] !== null || index <= currentQuestion) {
                      setCurrentQuestion(index);
                      setSelectedOption(null);
                      setSubmitted(false);
                    }
                  }}
                >
                  Q{index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizComponent;

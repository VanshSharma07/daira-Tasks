// import React, { useState } from "react";
// import axios from "axios";
// import { backendURL } from "../../definedURL";
// import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// const AudioQuiz = () => {
//   const [score, setScore] = useState(0);
//   const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
//   const [skippedQuestions, setSkippedQuestions] = useState(Array(10).fill(false));
//   const [selectedOptions, setSelectedOptions] = useState(Array(10).fill(null));
//   const navigate = useNavigate(); // Use the navigate hook for redirection

//   const questions = [
//     { word: "ο", options: ["c", "a", "o", "d", "e", "p"], correct: "o", audioSrc: "O.m4a" },
//     { word: "f", options: ["k", "h", "f", "j", "t", "g"], correct: "f", audioSrc: "F.m4a" },
//     { word: "b", options: ["p", "d", "q", "b", "g", "h"], correct: "b", audioSrc: "B.m4a" },
//     { word: "m", options: ["w", "n", "u", "m", "h", "s"], correct: "m", audioSrc: "M.m4a" },
//     { word: "no", options: ["oh", "on", "in", "no", "uo", "ou"], correct: "no", audioSrc: "No.m4a" },
//     { word: "cat", options: ["act", "tac", "cat", "atc", "cta"], correct: "cat", audioSrc: "Cat.m4a" },
//     { word: "girl", options: ["gril", "lirg", "irig", "girl", "glir"], correct: "girl", audioSrc: "Girl.m4a" },
//     { word: "little", options: ["kitten", "little", "like", "litter", "kettle"], correct: "little", audioSrc: "Little.m4a" },
//     { word: "help", options: ["hlep", "hple", "help", "pleh", "hlpe"], correct: "help", audioSrc: "Help.m4a" },
//     { word: "fast", options: ["staf", "fats", "fast", "taps", "saft"], correct: "fast", audioSrc: "Fast.m4a" }
//   ];

//   const handleAnswer = (index, selectedAnswer) => {
//     if (skippedQuestions[index]) return;

//     setSelectedOptions((prev) => {
//       const updated = [...prev];
//       updated[index] = selectedAnswer;
//       return updated;
//     });

//     const isCorrect = selectedAnswer === questions[index].correct;

//     setScore((prevScore) => {
//       if (answeredQuestions.has(index)) {
//         const previousAnswerCorrect = selectedOptions[index] === questions[index].correct;
//         return isCorrect && !previousAnswerCorrect
//           ? prevScore + 1
//           : !isCorrect && previousAnswerCorrect
//           ? prevScore - 1
//           : prevScore;
//       } else {
//         return isCorrect ? prevScore + 1 : prevScore;
//       }
//     });

//     setAnsweredQuestions((prev) => new Set(prev).add(index));
//   };

//   const handleSkip = (index) => {
//     setSkippedQuestions((prev) => {
//       const newSkipped = [...prev];
//       newSkipped[index] = !newSkipped[index];
//       return newSkipped;
//     });
//   };

//   const handleSubmit = async () => {
//     const token = localStorage.getItem("token");
//     const childId = localStorage.getItem("childId");

//     if (!childId) {
//       alert("No student data found. Please select a student before taking the test.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${backendURL}/addTest`,
//         {
//           childId: childId,
//           test_name: "Test 8: Audio Matching Quiz",
//           score: score,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 201) {
//         toast.success("Test submitted successfully!", {
//           position: "top-center", // Corrected position property
//           onClose: () => navigate('/'), // Navigate to the homepage on toast close
//         });
//       } else {
//         toast.error("Failed to submit test. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error submitting test:", error);
//       toast.error("An error occurred while submitting the test. Please try again.");
//     }
//   };

//   return (
//     <div className="p-8 overflow-auto h-screen bg-gray-200">
//       <div className="mb-8">
//         <h2 className="text-3xl font-roboto font-extrabold mb-7 flex items-center">
//           Audio Matching Quiz
//         </h2>
//         <div style={{ height: '2px', backgroundColor: '#ccc', width: '100%', marginBottom: '40px' }}></div>

//         {questions.map((question, index) => (
//           <div
//             key={index}
//             className="flex flex-col items-end mb-7 bg-white rounded-lg p-5 w-full"
//           >
//             <div className="w-full mb-4 text-left">
//               <span className={`text-xl font-bold ${skippedQuestions[index] ? "text-gray-500" : ""}`}>
//                 Question {index + 1} {skippedQuestions[index] && <span className="text-gray-500">: Skipped</span>}
//               </span>
//             </div>

//             <div className="w-full flex justify-end mb-4">
//               <div className="w-full">
//                 <AudioPlayer
//                   src={question.audioSrc}
//                   customProgressBarSection={['MAIN_CONTROLS', 'PROGRESS_BAR', 'DURATION']}
//                   customControlsSection={[]}
//                   customAdditionalControls={[]}
//                   showJumpControls={false}
//                   layout="horizontal"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-between w-full items-center space-x-4">
//               <div className="flex flex-wrap space-x-4">
//                 {question.options.map((option, optionIndex) => (
//                   <button
//                     key={optionIndex}
//                     className={`py-3 px-5 rounded-md text-lg transition transform duration-200 ${
//                       skippedQuestions[index]
//                         ? "border-2 border-gray-400 text-gray-400"
//                         : selectedOptions[index] === option
//                         ? "border-2 border-gray-600 text-black bg-[#ff937a]"
//                         : "border-2 border-gray-600 text-gray-600 hover:bg-[#ff937a] hover:text-black hover:translate-y-[-2px]"
//                     }`}
//                     onClick={() => handleAnswer(index, option)}
//                     disabled={skippedQuestions[index]}
//                   >
//                     {option}
//                   </button>
//                 ))}
//               </div>

//               <div className="flex justify-end flex-grow">
//                 <button
//                   className={`py-3 px-5 rounded-md text-lg transition transform duration-200 ${
//                     skippedQuestions[index]
//                       ? "border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
//                       : "border-2 border-gray-400 text-gray-400 hover:bg-white hover:text-gray-700 hover:border-gray-700"
//                   }`}
//                   onClick={() => handleSkip(index)}
//                 >
//                   {skippedQuestions[index] ? "Attempt" : "Skip"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}

//         <div className="flex justify-center mt-8">
//           <button
//             onClick={handleSubmit}
//             className="bg-green-500 text-white font-bold py-3 px-6 rounded-md text-lg transition transform duration-200 hover:bg-green-700 hover:translate-y-[-2px] shadow-lg"
//           >
//             Submit Test
//           </button>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default AudioQuiz;






// import React, { useState } from "react";
// import axios from "axios";
// import { backendURL } from "../../definedURL";
// import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// const AudioQuiz = () => {
//   const [score, setScore] = useState(0);
//   const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
//   const [skippedQuestions, setSkippedQuestions] = useState(Array(10).fill(false));
//   const [selectedOptions, setSelectedOptions] = useState(Array(10).fill(null));
//   const navigate = useNavigate(); // Use the navigate hook for redirection

//   const questions = [
//     { word: "ο", options: ["c", "a", "o", "d", "e", "p"], correct: "o", audioSrc: "O.m4a" },
//     { word: "f", options: ["k", "h", "f", "j", "t", "g"], correct: "f", audioSrc: "F.m4a" },
//     { word: "b", options: ["p", "d", "q", "b", "g", "h"], correct: "b", audioSrc: "B.m4a" },
//     { word: "m", options: ["w", "n", "u", "m", "h", "s"], correct: "m", audioSrc: "M.m4a" },
//     { word: "no", options: ["oh", "on", "in", "no", "uo", "ou"], correct: "no", audioSrc: "No.m4a" },
//     { word: "cat", options: ["act", "tac", "cat", "atc", "cta"], correct: "cat", audioSrc: "Cat.m4a" },
//     { word: "girl", options: ["gril", "lirg", "irig", "girl", "glir"], correct: "girl", audioSrc: "Girl.m4a" },
//     { word: "little", options: ["kitten", "little", "like", "litter", "kettle"], correct: "little", audioSrc: "Little.m4a" },
//     { word: "help", options: ["hlep", "hple", "help", "pleh", "hlpe"], correct: "help", audioSrc: "Help.m4a" },
//     { word: "fast", options: ["staf", "fats", "fast", "taps", "saft"], correct: "fast", audioSrc: "Fast.m4a" }
//   ];

//   const handleAnswer = (index, selectedAnswer) => {
//     if (skippedQuestions[index]) return;

//     setSelectedOptions((prev) => {
//       const updated = [...prev];
//       updated[index] = selectedAnswer;
//       return updated;
//     });

//     const isCorrect = selectedAnswer === questions[index].correct;

//     setScore((prevScore) => {
//       if (answeredQuestions.has(index)) {
//         const previousAnswerCorrect = selectedOptions[index] === questions[index].correct;
//         return isCorrect && !previousAnswerCorrect
//           ? prevScore + 1
//           : !isCorrect && previousAnswerCorrect
//           ? prevScore - 1
//           : prevScore;
//       } else {
//         return isCorrect ? prevScore + 1 : prevScore;
//       }
//     });

//     setAnsweredQuestions((prev) => new Set(prev).add(index));
//   };

//   const handleSkip = (index) => {
//     setSkippedQuestions((prev) => {
//       const newSkipped = [...prev];
//       newSkipped[index] = !newSkipped[index];
//       return newSkipped;
//     });
//   };

//   const handleSubmit = async () => {
//     const token = localStorage.getItem("token");
//     const childId = localStorage.getItem("childId");

//     if (!childId) {
//       alert("No student data found. Please select a student before taking the test.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${backendURL}/addTest`,
//         {
//           childId: childId,
//           test_name: "Test 8: Audio Matching Quiz",
//           score: score,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 201) {
//         toast.success("Test submitted successfully!", {
//           position: "top-center", // Corrected position property
//           onClose: () => navigate('/'), // Navigate to the homepage on toast close
//         });
//       } else {
//         toast.error("Failed to submit test. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error submitting test:", error);
//       toast.error("An error occurred while submitting the test. Please try again.");
//     }
//   };

//   return (
//     <div className="p-8 overflow-auto h-screen bg-gray-200">
//       <div className="mb-8">
//         <h2 className="text-3xl font-roboto font-extrabold mb-7 flex items-center">
//           Visual Discrimination Test
//         </h2>
//         <div style={{ height: '2px', backgroundColor: '#ccc', width: '100%', marginBottom: '40px' }}></div>

//         {questions.map((question, index) => (
//           <div
//             key={index}
//             className="flex flex-col items-end mb-7 bg-white rounded-lg p-5 w-full"
//           >
//             <div className="w-full mb-4 text-left">
//               <span className={`text-xl font-bold ${skippedQuestions[index] ? "text-gray-500" : ""}`}>
//                 Question {index + 1} {skippedQuestions[index] && <span className="text-gray-500">: Skipped</span>}
//               </span>
//             </div>

//             <div className="flex justify-between w-full items-center space-x-4">
//               {/* Display the word before the options */}
//               <div className="flex mr-20">
//               <button
//                     className="py-3 px-5 rounded-md text-lg transition transform duration-200 border-2 border-gray-600 text-gray-600"
//                   >
//                     {question.word}
//                   </button>
//               </div>

//               <div className="flex flex-wrap space-x-4">
//                 {question.options.map((option, optionIndex) => (
//                   <button
//                     key={optionIndex}
//                     className={`py-3 px-5 rounded-md text-lg transition transform duration-200 ${
//                       skippedQuestions[index]
//                         ? "border-2 border-gray-400 text-gray-400"
//                         : selectedOptions[index] === option
//                         ? "border-2 border-gray-600 text-black bg-[#ff937a]"
//                         : "border-2 border-gray-600 text-gray-600 hover:bg-[#ff937a] hover:text-black hover:translate-y-[-2px]"
//                     }`}
//                     onClick={() => handleAnswer(index, option)}
//                     disabled={skippedQuestions[index]}
//                   >
//                     {option}
//                   </button>
//                 ))}
//               </div>

//               <div className="flex justify-end flex-grow">
//                 <button
//                   className={`py-3 px-5 rounded-md text-lg transition transform duration-200 ${
//                     skippedQuestions[index]
//                       ? "border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
//                       : "border-2 border-gray-400 text-gray-400 hover:bg-white hover:text-gray-700 hover:border-gray-700"
//                   }`}
//                   onClick={() => handleSkip(index)}
//                 >
//                   {skippedQuestions[index] ? "Attempt" : "Skip"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}

//         <div className="flex justify-center mt-8">
//           <button
//             onClick={handleSubmit}
//             className="bg-green-500 text-white font-bold py-3 px-6 rounded-md text-lg transition transform duration-200 hover:bg-green-700 hover:translate-y-[-2px] shadow-lg"
//           >
//             Submit Test
//           </button>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default AudioQuiz;



import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../../definedURL";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AudioQuiz = () => {
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [skippedQuestions, setSkippedQuestions] = useState(Array(10).fill(false));
  const [selectedOptions, setSelectedOptions] = useState(Array(10).fill(null));
  const navigate = useNavigate();

  const questions = [
    { word: "ο", options: ["c", "a", "o", "d", "e", "p"], correct: "o", audioSrc: "O.m4a" },
    { word: "f", options: ["k", "h", "f", "j", "t", "g"], correct: "f", audioSrc: "F.m4a" },
    { word: "b", options: ["p", "d", "q", "b", "g", "h"], correct: "b", audioSrc: "B.m4a" },
    { word: "m", options: ["w", "n", "u", "m", "h", "s"], correct: "m", audioSrc: "M.m4a" },
    { word: "no", options: ["oh", "on", "in", "no", "uo", "ou"], correct: "no", audioSrc: "No.m4a" },
    { word: "cat", options: ["act", "tac", "cat", "atc", "cta"], correct: "cat", audioSrc: "Cat.m4a" },
    { word: "girl", options: ["gril", "lirg", "irig", "girl", "glir"], correct: "girl", audioSrc: "Girl.m4a" },
    { word: "little", options: ["kitten", "little", "like", "litter", "kettle"], correct: "little", audioSrc: "Little.m4a" },
    { word: "help", options: ["hlep", "hple", "help", "pleh", "hlpe"], correct: "help", audioSrc: "Help.m4a" },
    { word: "fast", options: ["staf", "fats", "fast", "taps", "saft"], correct: "fast", audioSrc: "Fast.m4a" }
  ];

  const handleAnswer = (index, selectedAnswer) => {
    console.log(`Handling answer for question ${index + 1}, selected option: ${selectedAnswer}`);

    if (skippedQuestions[index]) {
      console.log(`Question ${index + 1} was skipped, no action taken.`);
      return;
    }

    setSelectedOptions((prev) => {
      const updated = [...prev];
      updated[index] = selectedAnswer;
      console.log(`Updated selected options:`, updated);
      return updated;
    });

    const isCorrect = selectedAnswer === questions[index].correct;
    console.log(`Answer is ${isCorrect ? 'correct' : 'incorrect'}`);

    setScore((prevScore) => {
      if (answeredQuestions.has(index)) {
        const previousAnswerCorrect = selectedOptions[index] === questions[index].correct;
        const newScore = isCorrect && !previousAnswerCorrect
          ? prevScore + 1
          : !isCorrect && previousAnswerCorrect
          ? prevScore - 1
          : prevScore;
        console.log(`Updated score after re-answering question ${index + 1}: ${newScore}`);
        return newScore;
      } else {
        const newScore = isCorrect ? prevScore + 1 : prevScore;
        console.log(`Updated score: ${newScore}`);
        return newScore;
      }
    });

    setAnsweredQuestions((prev) => {
      const updatedSet = new Set(prev).add(index);
      console.log(`Answered questions set:`, updatedSet);
      return updatedSet;
    });
  };

  const handleSkip = (index) => {
    console.log(`Toggling skip status for question ${index + 1}`);
    setSkippedQuestions((prev) => {
      const newSkipped = [...prev];
      newSkipped[index] = !newSkipped[index];
      console.log(`Updated skipped questions:`, newSkipped);
      return newSkipped;
    });
  };

  const handleSubmit = async () => {
    console.log("Submitting quiz...");

    const token = localStorage.getItem("token");
    const childId = localStorage.getItem("childId");

    if (!childId) {
      alert("No student data found. Please select a student before taking the test.");
      return;
    }

    console.log("Child ID:", childId, "Token:", token);
    console.log("Final score:", score);

    try {
      const response = await axios.post(
        `${backendURL}/addTest`,
        {
          childId: childId,
          test_name: "Test 8: Audio Matching Quiz",
          score: score,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Test submission successful:", response.data);
        toast.success("Test submitted successfully!", {
          position: "top-center", 
          onClose: () => navigate('/'),
        });
      } else {
        console.error("Test submission failed with status:", response.status);
        toast.error("Failed to submit test. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting test:", error.response || error.message || error);
      toast.error("An error occurred while submitting the test. Please try again.");
    }
  };

  return (
    <div className="p-8 overflow-auto h-screen bg-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl font-roboto font-extrabold mb-7 flex items-center">
          Visual Discrimination Test
        </h2>
        <div style={{ height: '2px', backgroundColor: '#ccc', width: '100%', marginBottom: '40px' }}></div>

        {questions.map((question, index) => (
          <div
            key={index}
            className="flex flex-col items-end mb-7 bg-white rounded-lg p-5 w-full"
          >
            <div className="w-full mb-4 text-left">
              <span className={`text-xl font-bold ${skippedQuestions[index] ? "text-gray-500" : ""}`}>
                Question {index + 1} {skippedQuestions[index] && <span className="text-gray-500">: Skipped</span>}
              </span>
            </div>

            <div className="flex justify-between w-full items-center space-x-4">
              {/* Display the word before the options */}
              <div className="flex mr-20">
              <button
                    className="py-3 px-5 rounded-md text-lg transition transform duration-200 border-2 border-gray-600 text-gray-600"
                  >
                    {question.word}
                  </button>
              </div>

              <div className="flex flex-wrap space-x-4">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    className={`py-3 px-5 rounded-md text-lg transition transform duration-200 ${
                      skippedQuestions[index]
                        ? "border-2 border-gray-400 text-gray-400"
                        : selectedOptions[index] === option
                        ? "border-2 border-gray-600 text-black bg-[#ff937a]"
                        : "border-2 border-gray-600 text-gray-600 hover:bg-[#ff937a] hover:text-black hover:translate-y-[-2px]"
                    }`}
                    onClick={() => handleAnswer(index, option)}
                    disabled={skippedQuestions[index]}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-end flex-grow">
                <button
                  className={`py-3 px-5 rounded-md text-lg transition transform duration-200 ${
                    skippedQuestions[index]
                      ? "border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                      : "border-2 border-gray-400 text-gray-400 hover:bg-white hover:text-gray-700 hover:border-gray-700"
                  }`}
                  onClick={() => handleSkip(index)}
                >
                  {skippedQuestions[index] ? "Attempt" : "Skip"}
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white font-bold py-3 px-6 rounded-md text-lg transition transform duration-200 hover:bg-green-700 hover:translate-y-[-2px] shadow-lg"
          >
            Submit Test
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AudioQuiz;

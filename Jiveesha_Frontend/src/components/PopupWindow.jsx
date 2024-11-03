// PopupWindow.jsx
import React from "react";
import Popup from "reactjs-popup";

export default function PopupWindow({ reading_age, score, student_age, testName, correctWords, incorrectWords }) {
  console.log('PopupWindow received:', { correctWords, incorrectWords });

  return (
    <Popup
      trigger={
        <button className="flex justify-center items-center w-full h-full text-sm font-sans text-gray-800 border-gray-800 hover:text-black font-medium border border-gray-400 hover:border-black px-4 py-2 bg-transparent hover:bg-white hover:shadow-sm active:bg-blue-200 rounded-lg transition-all duration-300">
          Result
        </button>
      }
      modal
      closeOnDocumentClick
    >
      {(close) => (
        <div className="flex justify-center items-center fixed inset-0 z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-left font-medium">Student Age</label>
                <div className="w-full p-2 border rounded">
                  {student_age}
                </div>
              </div>

              {testName === "Test 6: Schonells Test" && (
                <>
                  <div>
                    <label className="block text-left font-medium">Reading Age</label>
                    <div className="w-full p-2 border rounded">
                      {reading_age}
                    </div>
                  </div>

                  <div>
                    <label className="block text-left font-medium">
                      Correct Words ({correctWords?.length || 0})
                    </label>
                    <div className="w-full p-2 border rounded bg-green-50 max-h-32 overflow-auto">
                      {correctWords?.length > 0 
                        ? correctWords.join(", ") 
                        : "No correct words recorded"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-left font-medium">
                      Incorrect Words ({incorrectWords?.length || 0})
                    </label>
                    <div className="w-full p-2 border rounded bg-red-50 max-h-32 overflow-auto">
                      {incorrectWords?.length > 0 
                        ? incorrectWords.join(", ") 
                        : "No incorrect words recorded"}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-left font-medium">Score</label>
                <div className="w-full p-2 border rounded">
                  {score}
                </div>
              </div>

              <button
                className="flex justify-center items-center w-full text-sm font-sans text-gray-800 border-gray-800 hover:text-black font-medium border border-gray-400 hover:border-black px-4 py-2 bg-transparent hover:bg-gray-100 hover:shadow-sm active:bg-blue-200 rounded-lg transition-all duration-300"
                onClick={close}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
}
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import WordGrid from "./WordGrid";
import styles from "../../styles/Test.module.css";
import { backendURL } from "../../definedURL";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaRegStopCircle } from "react-icons/fa";
import { PiDotsThreeBold } from "react-icons/pi";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import Toast styles

function Test() {
  const [givingTest, setGivingTest] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionReady, setTranscriptionReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false); // New state for recording indication
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Requesting media device access...");
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log("Media device access granted.");
        window.stream = stream;
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  }, [navigate]);

  const startListening = () => {
    console.log("Start listening for audio...");
    if (window.stream) {
      setIsRecording(true); // Indicate recording has started
      let localAudioChunks = [];
      const newMediaRecorder = new MediaRecorder(window.stream);

      newMediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("Data available in media recorder:", event.data);
          localAudioChunks.push(event.data);
        }
      };

      newMediaRecorder.onstop = async () => {
        console.log("Media recorder stopped, processing audio...");
        setIsRecording(false); // Indicate recording has stopped
        if (localAudioChunks.length > 0) {
          const audioBlob = new Blob(localAudioChunks, { type: "audio/wav" });
          const file = new File([audioBlob], "user_audio.wav", { type: "audio/wav" });
          console.log("Audio file created:", file);

          try {
            setIsTranscribing(true);
            console.log("Sending audio for transcription...");
            
            const data = await file.arrayBuffer(); // Convert file to buffer to send via API
            const response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-large-v3", {
              headers: {
                Authorization: "Bearer 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", // Your Whisper API token here
                "Content-Type": "application/octet-stream",
              },
              method: "POST",
              body: data,
            });

            if (response.ok) {
              const result = await response.json();
              setTranscript(result.text);  // Assuming Whisper API returns `text`
              setTranscriptionReady(true);
              console.log("Transcription result:", result.text);
            } else {
              console.error("Error during transcription:", response.statusText);
            }
          } catch (error) {
            console.error("Error uploading audio:", error);
          } finally {
            setIsTranscribing(false);
          }
        }
      };

      newMediaRecorder.start();
      console.log("Media recorder started.");
    } else {
      console.error("Media stream not initialized.");
    }
  };

  const stopListening = () => {
    console.log("Stopping media stream...");
    if (window.stream) {
      setIsRecording(false); // Indicate recording has stopped
      const tracks = window.stream.getTracks();
      tracks.forEach((track) => track.stop());
      console.log("Media stream stopped.");
    } else {
      console.error("Media stream not initialized.");
    }
  };

  const handleSubmit = async () => {
    console.log("Handling submission...");
    if (!transcriptionReady) {
      console.log("Transcription is not ready yet. Please wait...");
      return;
    }

    const wordsArray = transcript
      .split(" ")
      .map((word) => word.toLowerCase().replace(/[^a-z]/g, ""));
    console.log("Words extracted from transcript:", wordsArray);

    const { score, age, correctWords, incorrectWords } = await checkWords(wordsArray);
    console.log(`Score: ${score}, Age: ${age}, Correct Words: ${correctWords}, Incorrect Words: ${incorrectWords}`);

    const childId = localStorage.getItem('childId');  // Fetching childId from localStorage
    const token = localStorage.getItem('token');  // Fetching token from localStorage
    console.log("Child ID:", childId, "Token:", token);

    try {
      console.log("Sending test data to backend...");
      const responseFromApi = await axios.post(
        `${backendURL}/addTest`,
        {
          childId,
          test_name: "Test 6: Schonells Test",
          reading_age: age,
          score,
          correctWords,
          incorrectWords,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (responseFromApi.status === 201) {
        console.log("Test submitted successfully:", responseFromApi.data);
        toast.success("Test submitted successfully!", {
          position: "top-center",  // Position the toast
          onClose: () => navigate('/'),  // Redirect to homepage on toast close
        });
      } else {
        console.error("Failed to submit test. Status:", responseFromApi.status);
        toast.error("Failed to submit test. Please try again.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error submitting test results:", error);
      toast.error("An error occurred while submitting the test.", {
        position: "top-center",
      });
    }
  };

  const checkWords = async (words) => {
    console.log("Checking words against word grid...");
    let score = 0;
    let correctWords = [];
    let incorrectWords = [];

    const flatWordsGrid = wordsGrid.flat();

    const cleanedWords = words.filter(word => word.trim() !== "");

    for (let i = 0; i < cleanedWords.length; i++) {
      if (flatWordsGrid[i] === cleanedWords[i]) {
        score++;
        correctWords.push(cleanedWords[i]); // Add to correct words list
      } else {
        incorrectWords.push(cleanedWords[i]); // Add to incorrect words list
      }
    }

    if(score === 0) {
      correctWords.push("No correct words found");
      incorrectWords.push("No incorrect words found");
    }

    const tempAge = getReadingAge(score);
    return { score, age: tempAge, correctWords, incorrectWords };
  };

  const getReadingAge = (score) => {
    console.log("Calculating reading age based on score...");
    const match = readingAgeMap.find((entry) => entry.score === score);
    return match ? match.age : "N/A";
  };

  return (
    <>
      {givingTest && (
        <div className={`${styles.container} ${givingTest ? styles.giveHeight : ''}`}>
          <div className={styles.testBox}>
            <WordGrid />
            <div className={styles.buttonBox}>
              <FaRegCirclePlay onClick={startListening} className={`${styles.iconButton} ${isRecording ? styles.recording : ''}`} />
              <FaRegStopCircle onClick={stopListening} className={`${styles.iconButton} ${!isRecording ? styles.notRecording : ''}`} />
              {isTranscribing ? (
                <PiDotsThreeBold className={styles.iconButton} />
              ) : (
                <MdOutlineArrowCircleRight onClick={handleSubmit} disabled={!transcriptionReady} className={styles.iconButtonsubmit} />
              )}
            </div>
            {isRecording && <p className={styles.recordingText}>Recording in progress...</p>}
          </div>
        </div>
      )}
      <ToastContainer />  {/* Toast container to display notifications */}
    </>
  );
}


export default Test;



const readingAgeMap = [
  { score: 0, age: "5.9" },
  { score: 1, age: "5.9" },
  { score: 2, age: "6.0" },
  { score: 3, age: "6.2" },
  { score: 4, age: "6.4" },
  { score: 5, age: "6.5" },
  { score: 6, age: "6.6" },
  { score: 7, age: "6.7" },
  { score: 8, age: "6.7" },
  { score: 9, age: "6.8" },
  { score: 10, age: "6.9" },
  { score: 11, age: "6.10" },
  { score: 12, age: "6.10" },
  { score: 13, age: "6.11" },
  { score: 14, age: "6.11" },
  { score: 15, age: "7.0" },
  { score: 16, age: "7.1" },
  { score: 17, age: "7.2" },
  { score: 18, age: "7.2" },
  { score: 19, age: "7.3" },
  { score: 20, age: "7.4" },
  { score: 21, age: "7.4" },
  { score: 22, age: "7.5" },
  { score: 23, age: "7.5" },
  { score: 24, age: "7.6" },
  { score: 25, age: "7.7" },
  { score: 26, age: "7.7" },
  { score: 27, age: "7.8" },
  { score: 28, age: "7.9" },
  { score: 29, age: "7.10" },
  { score: 30, age: "8.0" },
  { score: 31, age: "8.1" },
  { score: 32, age: "8.2" },
  { score: 33, age: "8.3" },
  { score: 34, age: "8.4" },
  { score: 35, age: "8.5" },
  { score: 36, age: "8.6" },
  { score: 37, age: "8.6" },
  { score: 38, age: "8.7" },
  { score: 39, age: "8.8" },
  { score: 40, age: "8.9" },
  { score: 41, age: "8.10" },
  { score: 42, age: "8.11" },
  { score: 43, age: "9.0" },
  { score: 44, age: "9.1" },
  { score: 45, age: "9.2" },
  { score: 46, age: "9.3" },
  { score: 47, age: "9.4" },
  { score: 48, age: "9.5" },
  { score: 49, age: "9.6" },
  { score: 50, age: "9.6" },
  { score: 51, age: "9.7" },
  { score: 52, age: "9.8" },
  { score: 53, age: "9.9" },
  { score: 54, age: "9.10" },
  { score: 55, age: "9.11" },
  { score: 56, age: "10.0" },
  { score: 57, age: "10.1" },
  { score: 58, age: "10.1" },
  { score: 59, age: "10.2" },
  { score: 60, age: "10.3" },
  { score: 61, age: "10.4" },
  { score: 62, age: "10.5" },
  { score: 63, age: "10.6" },
  { score: 64, age: "10.7" },
  { score: 65, age: "10.8" },
  { score: 66, age: "10.9" },
  { score: 67, age: "10.10" },
  { score: 68, age: "11.0" },
  { score: 69, age: "11.1" },
  { score: 70, age: "11.3" },
  { score: 71, age: "11.4" },
  { score: 72, age: "11.5" },
  { score: 73, age: "11.6" },
  { score: 74, age: "11.8" },
  { score: 75, age: "11.10" },
  { score: 76, age: "12.0" },
  { score: 77, age: "12.1" },
  { score: 78, age: "12.2" },
  { score: 79, age: "12.3" },
  { score: 80, age: "12.4" },
  { score: 81, age: "12.5" },
  { score: 82, age: "12.6" },
  { score: 83, age: "12.6+" },
  { score: 84, age: "12.6+" },
  { score: 85, age: "12.6+" },
  { score: 86, age: "12.6+" },
  { score: 87, age: "12.6+" },
  { score: 88, age: "12.6+" },
  { score: 89, age: "12.6+" },
  { score: 90, age: "12.6+" },
  { score: 91, age: "12.6+" },
  { score: 92, age: "12.6+" },
  { score: 93, age: "12.6+" },
  { score: 94, age: "12.6+" },
  { score: 95, age: "12.6+" },
  { score: 96, age: "12.6+" },
  { score: 97, age: "12.6+" },
  { score: 98, age: "12.6+" },
  { score: 99, age: "12.6+" },
  { score: 100, age: "12.6+" },
];

const wordsGrid = [
  ["tree", "little", "milk", "egg", "book"],            // Row 1
  ["school", "sit", "frog", "playing", "bun"],          // Row 2
  ["flower", "road", "clock", "train", "light"],        // Row 3
  ["picture", "think", "summer", "people", "something"],// Row 4
  ["dream", "downstairs", "biscuit", "shepherd", "thirsty"], // Row 5
  ["crowd", "sandwich", "beginning", "postage", "island"],   // Row 6
  ["saucer", "angel", "sailing", "appeared", "knife"],       // Row 7
  ["canary", "attractive", "imagine", "nephew", "gradually"],// Row 8
  ["smoulder", "applaud", "disposal", "nourished", "diseased"], // Row 9
  ["university", "orchestra", "knowledge", "audience", "situated"], // Row 10
  ["physics", "campaign", "choir", "intercede", "fascinate"], // Row 11
  ["forfeit", "siege", "pavement", "plausible", "prophecy"],  // Row 12
  ["colonel", "soloist", "systematic", "slovenly", "classification"], // Row 13
  ["genuine", "institution", "pivot", "conscience", "heroic"], // Row 14
  ["pneumonia", "preliminary", "antique", "susceptible", "enigma"],   // Row 15
  ["oblivion", "scintillate", "satirical", "sabre", "beguile"],  // Row 16
  ["terrestrial", "belligerent", "adamant", "sepulchre", "statistics"], // Row 17
  ["miscellaneous", "procrastinate", "tyrannical", "evangelical", "grotesque"], // Row 18
  ["ineradicable", "judicature", "preferential", "homonym", "fictitious"], // Row 19
  ["rescind", "metamorphosis", "somnambulist", "bibliography", "idiosyncrasy"]  // Row 20
];








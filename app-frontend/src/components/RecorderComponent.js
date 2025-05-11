// import React, { useRef, useState } from "react";
// import { Mic, Upload, StopCircle } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@mui/material";

// const Recorder = ({ onAudioReady }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [audioBlob, setAudioBlob] = useState(null);

//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleStartRecording = async () => {
//     setIsRecording(true);
//     setRecordingTime(0);
//     setAudioBlob(null);
//   };

//   const handleStopRecording = () => {
//     console.log("handleStopRecording", isRecording, recordingTime);
//     setIsRecording(false);
//   };

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const handleFileChange = (e) => {
//     console.log("handleFileChange");
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsUploading(true);

//     // Check file type
//     if (!file.type.startsWith("audio/")) {
//       toast.error("Please upload an audio file");
//       setIsUploading(false);
//       return;
//     }

//     // Check file size (max 50MB)
//     if (file.size > 50 * 1024 * 1024) {
//       toast.error("File size should be less than 50MB");
//       setIsUploading(false);
//       return;
//     }

//     // Process the file
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (reader.result instanceof ArrayBuffer) {
//         const blob = new Blob([reader.result], { type: file.type });
//         onAudioReady(blob, "upload");
//         toast.success("Audio file uploaded successfully");
//       }
//       setIsUploading(false);
//     };

//     reader.onerror = () => {
//       toast.error("Error reading the file");
//       setIsUploading(false);
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   React.useEffect(() => {
//     if (audioBlob && !isRecording) {
//       onAudioReady(audioBlob, "record");
//       toast.success("Recording completed successfully");
//     }
//   }, [audioBlob, isRecording, onAudioReady]);

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
//       <h2 className="text-2xl font-bold mb-4 text-center">Audio Recorder</h2>

//       <div className="relative mb-6">
//         {isRecording && (
//           <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium animate-pulse">
//             {formatTime(recordingTime)}
//           </div>
//         )}
//       </div>

//       <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
//         <div className="flex-1">
//           <Button
//             onClick={triggerFileInput}
//             variant="outlined"
//             size="large"
//             disabled={isRecording || isUploading}
//             className="w-full"
//           >
//             <Upload className="mr-2 h-5 w-5" />
//             <span>{isUploading ? "Uploading..." : "Upload Audio File"}</span>
//           </Button>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="audio/*"
//             onChange={handleFileChange}
//             className="hidden"
//             style={{ display: "none" }}
//           />
//         </div>

//         <div className="flex-1">
//           {!isRecording ? (
//             <Button
//               onClick={handleStartRecording}
//               size="large"
//               className="w-full bg-purple-600 hover:bg-purple-700 text-white h-16"
//               disabled={isUploading}
//             >
//               <Mic className="mr-2 h-5 w-5" />
//               <span>Record Now</span>
//             </Button>
//           ) : (
//             <Button
//               onClick={handleStopRecording}
//               size="large"
//               variant="contained"
//               className="w-full h-16 animate-pulse"
//             >
//               <StopCircle className="mr-2 h-5 w-5" />
//               <span>Stop Recording</span>
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Recorder;

import React, { useRef, useState } from "react";
import { Mic, StopCircle, Upload } from "lucide-react";
import { Button } from "@mui/material";
import { toast } from "sonner";

const Recorder = ({
  setTranscript,
  setSoapNotes,
  setIsProcessing,
  setLabels,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      chunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        const uniqueFileName = `recording_${Date.now()}_${Math.floor(
          Math.random() * 1000
        )}.webm`;
        sendToAPI(blob, uniqueFileName);
      };

      mediaRecorderRef.current.start();

      intervalRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);

      setRecordingTime(0);
      setIsRecording(true);
    } catch (error) {
      toast.error("Microphone access denied");
      console.error(error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(intervalRef.current);
      setIsRecording(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      toast.error("Please upload a valid audio file");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size should be less than 50MB");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const blob = new Blob([reader.result], { type: file.type });
        await sendToAPI(blob, file.name);
      };
      reader.onerror = () => {
        toast.error("Failed to read the file");
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      toast.error("Upload failed");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const sendToAPI = async (
    audioBlob,
    filename = `recording_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.webm`
  ) => {
    const formData = new FormData();
    formData.append("file", audioBlob, filename);

    try {
      setIsProcessing(true);
      const response = await fetch("http://localhost:5000/generate-note", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setIsProcessing(false);
        throw new Error("Server responded with an error");
      }

      const data = await response.json();

      setIsProcessing(false);

      if (data.transcript) {
        setTranscript(data.transcript);
        setSoapNotes(data.notes);
        setLabels(data.speaker_label);
        toast.success("Transcript received");
      } else {
        toast.warning("No transcript returned from server");
      }
    } catch (err) {
      setIsProcessing(false);
      toast.error("Upload failed");
      console.error(err);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remaining
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Audio Recorder</h2>

      {isRecording && (
        <div className="text-center text-red-600 font-mono text-lg animate-pulse mb-4">
          {formatTime(recordingTime)}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={triggerFileInput}
          variant="outlined"
          fullWidth
          disabled={isRecording || isUploading}
          startIcon={<Upload />}
        >
          {isUploading ? "Uploading..." : "Upload Audio File"}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {!isRecording ? (
          <Button
            onClick={handleStartRecording}
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<Mic />}
          >
            Record
          </Button>
        ) : (
          <Button
            onClick={handleStopRecording}
            variant="contained"
            color="error"
            fullWidth
            startIcon={<StopCircle />}
          >
            Stop
          </Button>
        )}
      </div>
    </div>
  );
};

export default Recorder;

import React, { useState } from "react";
import TranscriptViewer from "../components/TranscriptViewer";
import Recorder from "../components/RecorderComponent";
import { Container } from "@mui/material";

const Index = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [labels, setLabels] = useState([]);
  const [soapNotes, setSoapNotes] = useState({});

  // This function would normally send audio to a transcription API
  // but for this demo we'll simulate it
  // const processAudioForTranscription = async (audioBlob, source) => {
  //   setIsProcessing(true);
  //   setAudioUrl(URL.createObjectURL(audioBlob));

  //   // Simulate API call with timeout
  //   setTimeout(() => {
  //     // Sample transcript based on source
  //     if (source === "record") {
  //       setTranscript(transcriptObject);

  //       // Generate sample SOAP notes
  //       setSoapNotes(notes);
  //     } else {
  //       setTranscript(transcriptObject);

  //       // Generate sample SOAP notes for uploaded audio
  //       setSoapNotes(notes);
  //     }
  //     setIsProcessing(false);
  //   }, 3000);
  // };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-purple-700 dark:text-purple-400">
            Audio Recorder & Transcriber
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Container className="mb-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <Recorder
            setIsProcessing={setIsProcessing}
            setTranscript={setTranscript}
            setSoapNotes={setSoapNotes}
            setLabels={setLabels}
          />
        </Container>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <TranscriptViewer
            audioUrl={audioUrl}
            transcript={transcript}
            soapNotes={soapNotes}
            isProcessing={isProcessing}
            labels={labels}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;

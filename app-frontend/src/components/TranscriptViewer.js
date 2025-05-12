import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Paper,
  Grid,
  Button,
  Box,
} from "@mui/material";
import TranscriptListViewer from "./TranscriptListViewer";

// NotesViewer using Material UI
const NotesViewer = ({ notes, NotesClickHandler }) => {
  return (
    <Box sx={{ flex: 1, height: 300, overflowY: "auto", textAlign: "left" }}>
      {Object.keys(notes).map((key) => (
        <Box key={key} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {key}
          </Typography>
          {notes[key].length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              n/a
            </Typography>
          ) : (
            notes[key].map((note, idx) => {
              return (
                <Box
                  key={idx}
                  sx={{
                    cursor: "pointer",
                    ":hover": { backgroundColor: "grey.100" },
                    p: 1,
                    borderRadius: 1,
                  }}
                  onClick={() => NotesClickHandler({ note })}
                >
                  <Typography variant="body2">{note.note}</Typography>
                </Box>
              );
            })
          )}
        </Box>
      ))}
    </Box>
  );
};

// TranscriptViewer using Material UI
const TranscriptViewer = ({
  audioUrl,
  transcript,
  soapNotes,
  isProcessing,
  labels,
}) => {
  const [highlightedId, setHighlightedId] = useState(null);

  const NotesClickHandler = ({ note }) => {
    console.log("note>>>>>>", note);
    const elementId = note?.timestamps[0];
    setHighlightedId(elementId || "");
  };

  return (
    <Card>
      <CardHeader title="Medical Transcription" />
      <CardContent>
        {audioUrl && (
          <Box sx={{ mb: 3 }}>
            <audio controls style={{ width: "100%" }}>
              <source src={audioUrl} />
              Your browser does not support the audio element.
            </audio>
          </Box>
        )}

        {isProcessing && (
          <Box
            sx={{
              py: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                borderTop: "4px solid #9c27b0",
                borderBottom: "4px solid #9c27b0",
                animation: "spin 1s linear infinite",
              }}
            />
            <Typography sx={{ mt: 2 }} color="text.secondary">
              Processing your audio...
            </Typography>
          </Box>
        )}
        {!isProcessing && transcript && transcript["utterances"] && (
          <Grid container spacing={4}>
            {/* SOAP Notes */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                SOAP Notes
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, height: 300, overflowY: "auto" }}
              >
                {soapNotes ? (
                  <NotesViewer
                    notes={soapNotes}
                    NotesClickHandler={NotesClickHandler}
                  />
                ) : (
                  <Typography color="text.secondary">
                    SOAP notes will appear here after processing audio
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Transcript */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Audio Transcript
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, height: 300, overflowY: "auto" }}
              >
                {transcript && transcript["utterances"] ? (
                  <TranscriptListViewer
                    transcript={transcript}
                    highlightedId={highlightedId}
                    labels={labels}
                  />
                ) : (
                  <Typography color="text.secondary">
                    Transcript will appear here after processing audio
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptViewer;

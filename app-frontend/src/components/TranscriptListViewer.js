import React, { useEffect, useRef } from "react";

const TranscriptListViewer = ({ transcript, highlightedId }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (highlightedId) {
      const start = highlightedId.split("-")[0].trim();
      const end = highlightedId.split("-")[1].trim();

      const el = document.querySelector(`[id^="${start} -"]`);
      if (el && containerRef.current) {
        // Scroll the highlighted element into view with a smooth animation
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Add a brief flash animation to make the highlight more noticeable
        el.style.transition = "background-color 0.3s";
        const originalBackground = el.style.backgroundColor;
        el.style.backgroundColor = "rgba(255, 165, 0, 0.5)"; // Flash with orange
        setTimeout(() => {
          el.style.backgroundColor = originalBackground;
        }, 5000);
      }

      const el2 = document.querySelector(`[id$="- ${end}"]`);
      if (el2 && containerRef.current) {
        // Scroll the highlighted element into view with a smooth animation
        el2.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Add a brief flash animation to make the highlight more noticeable
        el2.style.transition = "background-color 0.3s";
        const originalBackground = el2.style.backgroundColor;
        el2.style.backgroundColor = "rgba(255, 165, 0, 0.5)"; // Flash with orange
        setTimeout(() => {
          el2.style.backgroundColor = originalBackground;
        }, 5000);
      }
    }
  }, [highlightedId]);

  // const start = highlightedId ? highlightedId.split("-")[0].trim() : "";
  // const end = highlightedId ? highlightedId.split("-")[1].trim() : "";
  // console.log("start>>>>>>", { start, end });
  // const highlightStyle = {
  //   borderColor: "red",
  //   borderWidth: "2px",
  //   backgroundColor: "rgba(255, 0, 0, 0.1)",
  //   padding: "8px",
  //   marginBottom: "4px",
  //   borderStyle: "solid",
  //   textAlign: "left",
  // };

  const defaultStyle = {
    borderColor: "white",
    borderWidth: "1px",
    padding: "8px",
    marginBottom: "4px",
    borderStyle: "solid",
    textAlign: "left",
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 h-64 border rounded-md p-4 overflow-y-auto text-left"
    >
      {transcript["utterances"].map((utterance, index) => (
        <div
          id={`${utterance.start} - ${utterance.end}`}
          key={index}
          style={defaultStyle}
        >
          <b>Speaker: {utterance.speaker}</b>: {utterance.text}
        </div>
      ))}
    </div>
  );
};
export default TranscriptListViewer;

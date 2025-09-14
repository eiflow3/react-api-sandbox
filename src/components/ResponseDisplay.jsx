import React from "react";

const ResponseDisplay = ({ response }) => {
  if (!response) return null;

  return (
    <div
      style={{
        backgroundColor: "#f8f8f8",
        border: "2px solid #000000",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          color: "#000000",
          fontSize: "20px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            backgroundColor: "#000000",
            borderRadius: "50%",
          }}
        ></span>
        Response
      </h3>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #cccccc",
          borderRadius: "8px",
          padding: "16px",
          overflow: "auto",
          maxHeight: "400px",
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#000000",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>

      <div
        style={{
          marginTop: "12px",
          fontSize: "14px",
          color: "#666666",
          textAlign: "right",
        }}
      >
        Response received • {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ResponseDisplay;

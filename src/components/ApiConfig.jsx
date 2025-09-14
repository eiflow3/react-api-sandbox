import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const JsonEditor = ({ value, onChange, placeholder }) => {
  const [isValidJson, setIsValidJson] = useState(true);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Validate JSON (ignoring comments for now)
    try {
      if (newValue.trim()) {
        // Simple validation - try to parse after removing comments
        const cleaned = newValue
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/.*$/gm, "");
        JSON.parse(cleaned);
      }
      setIsValidJson(true);
    } catch {
      setIsValidJson(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <textarea
        value={value}
        onChange={handleChange}
        style={{
          width: "100%",
          height: "200px",
          padding: "16px",
          border: `2px solid ${isValidJson ? "#000000" : "#ff4444"}`,
          borderRadius: "8px",
          fontSize: "14px",
          fontFamily:
            "'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace",
          backgroundColor: "#1e1e1e",
          color: "#d4d4d4",
          outline: "none",
          resize: "vertical",
          lineHeight: "1.5",
          tabSize: "2",
          whiteSpace: "pre",
          overflowWrap: "normal",
          overflowX: "auto",
          caretColor: "#d4d4d4",
        }}
        placeholder={placeholder}
        spellCheck="false"
      />
    </div>
  );
};

const ApiConfig = ({
  endpoint,
  setEndpoint,
  method,
  setMethod,
  payload,
  setPayload,
  contentType,
  setContentType,
  authEnabled,
  setAuthEnabled,
  authType,
  setAuthType,
  authValue,
  setAuthValue,
}) => {
  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  const needsPayload = ["POST", "PUT", "PATCH"].includes(method);

  const contentTypes = [
    "application/json",
    "application/xml",
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain",
    "text/html",
    "text/xml",
    "application/octet-stream",
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "audio/mpeg",
    "video/mp4",
  ];

  const authTypes = [
    "Bearer",
    "Basic",
    "Digest",
    "OAuth",
    "API-Key",
    "JWT",
    "AWS4-HMAC-SHA256",
    "NTLM",
    "Negotiate",
  ];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "2px solid #000000",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          margin: "0 0 20px 0",
          color: "#000000",
          fontSize: "24px",
          fontWeight: "600",
          borderBottom: "2px solid #000000",
          paddingBottom: "8px",
        }}
      >
        API Configuration
      </h2>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#000000",
            fontSize: "16px",
          }}
        >
          Endpoint URL:
        </label>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #000000",
            borderRadius: "8px",
            fontSize: "16px",
            fontFamily: "monospace",
            backgroundColor: "#ffffff",
            color: "#000000",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          placeholder="https://api.example.com/users"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#000000",
            fontSize: "16px",
          }}
        >
          HTTP Method:
        </label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{
            padding: "12px",
            border: "2px solid #000000",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            backgroundColor: "#ffffff",
            color: "#000000",
            minWidth: "140px",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {methods.map((method) => (
            <option
              key={method}
              value={method}
              style={{ backgroundColor: "#ffffff", color: "#000000" }}
            >
              {method}
            </option>
          ))}
        </select>
      </div>

      {/* Headers Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            margin: "0 0 16px 0",
            color: "#000000",
            fontSize: "18px",
            fontWeight: "600",
            borderBottom: "1px solid #cccccc",
            paddingBottom: "4px",
          }}
        >
          Headers
        </h3>

        {/* Content-Type */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#000000",
              fontSize: "14px",
            }}
          >
            Content-Type:
          </label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000000",
              borderRadius: "8px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              color: "#000000",
              cursor: "pointer",
              outline: "none",
            }}
          >
            {contentTypes.map((type) => (
              <option
                key={type}
                value={type}
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Authorization Toggle */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
              color: "#000000",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={authEnabled}
              onChange={(e) => setAuthEnabled(e.target.checked)}
              style={{
                width: "16px",
                height: "16px",
                cursor: "pointer",
              }}
            />
            Enable Authorization
          </label>
        </div>

        {/* Authorization Details */}
        {authEnabled && (
          <div
            style={{
              backgroundColor: "#f8f8f8",
              border: "1px solid #cccccc",
              borderRadius: "8px",
              padding: "16px",
              marginTop: "8px",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#000000",
                  fontSize: "14px",
                }}
              >
                Auth Type:
              </label>
              <select
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #cccccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {authTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                    style={{ backgroundColor: "#ffffff", color: "#000000" }}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#000000",
                  fontSize: "14px",
                }}
              >
                Auth Value:
              </label>
              <input
                type="text"
                value={authValue}
                onChange={(e) => setAuthValue(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #cccccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  outline: "none",
                }}
                placeholder={
                  authType === "Basic"
                    ? "base64-encoded-credentials"
                    : authType === "Bearer"
                    ? "your-jwt-token"
                    : authType === "API-Key"
                    ? "your-api-key"
                    : "your-auth-value"
                }
              />
            </div>
          </div>
        )}
      </div>

      {needsPayload && (
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#000000",
              fontSize: "16px",
            }}
          >
            Request Payload (JSON):
          </label>
          <JsonEditor
            value={payload}
            onChange={setPayload}
            placeholder='{"key": "value", "name": "John Doe"}'
          />
        </div>
      )}
    </div>
  );
};

export default ApiConfig;

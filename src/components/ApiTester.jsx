import React from "react";

// Native Fetch Component
const NativeFetchTester = ({
  triggerApi,
  nativeFetchError,
  nativeFetchSuccess,
}) => {
  console.log(
    "Native Fetch Component - error:",
    nativeFetchError,
    "isSuccess:",
    nativeFetchSuccess
  );
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "2px solid #000000",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          color: "#000000",
          fontSize: "18px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            backgroundColor: "#000000",
            borderRadius: "50%",
          }}
        ></span>
        Native Fetch API Call
      </h3>

      <button
        onClick={triggerApi}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: "#000000",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s",
          marginBottom: "16px",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#333333";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#000000";
        }}
      >
        Execute Request
      </button>

      {nativeFetchError ? (
        <div
          style={{
            backgroundColor: "#f8f8f8",
            border: "1px solid #cccccc",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h4
            style={{
              margin: "0 0 8px 0",
              color: "#cc0000",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Error
          </h4>
          <div style={{ fontSize: "14px", color: "#000000" }}>
            <strong>Status Code:</strong> {nativeFetchError.statusCode || "N/A"}
          </div>
          <div style={{ fontSize: "14px", color: "#000000", marginTop: "4px" }}>
            <strong>Message:</strong>{" "}
            {nativeFetchError.message || "Unknown error"}
          </div>
        </div>
      ) : null}

      {nativeFetchSuccess && !nativeFetchError && (
        <div
          style={{
            backgroundColor: "#f0f0f0",
            border: "1px solid #cccccc",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "center",
            color: "#000000",
            fontSize: "14px",
          }}
        >
          ✓ Request completed successfully! Check the response section above.
        </div>
      )}
    </div>
  );
};

// React Query Component
const ReactQueryTester = ({
  triggerApiWithQuery,
  mutation,
  reactQueryError,
  reactQuerySuccess,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "2px solid #000000",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          color: "#000000",
          fontSize: "18px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            backgroundColor: "#000000",
            borderRadius: "50%",
          }}
        ></span>
        React Query API Call
      </h3>

      <button
        onClick={triggerApiWithQuery}
        disabled={mutation.isPending}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: mutation.isPending ? "#cccccc" : "#000000",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: mutation.isPending ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          marginBottom: "16px",
        }}
        onMouseOver={(e) => {
          if (!mutation.isPending) {
            e.target.style.backgroundColor = "#333333";
          }
        }}
        onMouseOut={(e) => {
          if (!mutation.isPending) {
            e.target.style.backgroundColor = "#000000";
          }
        }}
      >
        {mutation.isPending ? "Executing..." : "Execute Request"}
      </button>

      {mutation.isPending && (
        <div
          style={{
            textAlign: "center",
            padding: "16px",
            color: "#666666",
            fontSize: "14px",
          }}
        >
          Processing request...
        </div>
      )}

      {reactQueryError ? (
        <div
          style={{
            backgroundColor: "#f8f8f8",
            border: "1px solid #cccccc",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h4
            style={{
              margin: "0 0 8px 0",
              color: "#cc0000",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Error
          </h4>
          <div style={{ fontSize: "14px", color: "#000000" }}>
            <strong>Status Code:</strong> {reactQueryError.statusCode || "N/A"}
          </div>
          <div style={{ fontSize: "14px", color: "#000000", marginTop: "4px" }}>
            <strong>Message:</strong>{" "}
            {reactQueryError.message || "Unknown error"}
          </div>
        </div>
      ) : null}

      {reactQuerySuccess && (
        <div
          style={{
            backgroundColor: "#f0f0f0",
            border: "1px solid #cccccc",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "center",
            color: "#000000",
            fontSize: "14px",
          }}
        >
          ✓ Request completed successfully! Check the response section above.
        </div>
      )}
    </div>
  );
};

const ApiTester = ({
  triggerApi,
  triggerApiWithQuery,
  nativeFetchError,
  nativeFetchSuccess,
  reactQueryError,
  reactQuerySuccess,
  mutation,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        marginBottom: "24px",
      }}
    >
      <NativeFetchTester
        triggerApi={triggerApi}
        nativeFetchError={nativeFetchError}
        nativeFetchSuccess={nativeFetchSuccess}
      />
      <ReactQueryTester
        triggerApiWithQuery={triggerApiWithQuery}
        mutation={mutation}
        reactQueryError={reactQueryError}
        reactQuerySuccess={reactQuerySuccess}
      />
    </div>
  );
};

export default ApiTester;

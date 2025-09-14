import { useMutation } from "@tanstack/react-query";
import "./App.css";
import "./styles.css";
import ApiConfig from "./components/ApiConfig";
import ResponseDisplay from "./components/ResponseDisplay";
import ApiTester from "./components/ApiTester";
import useApiConfigStore from "./stores/apiConfigStore";
import useHeadersStore from "./stores/headersStore";
import useResponseStore from "./stores/responseStore";

function App() {
  // API Configuration Store
  const { endpoint, method, payload, setEndpoint, setMethod, setPayload } =
    useApiConfigStore();

  // Headers Store
  const {
    contentType,
    authEnabled,
    authType,
    authValue,
    setContentType,
    setAuthEnabled,
    setAuthType,
    setAuthValue,
    buildHeaders,
  } = useHeadersStore();

  // Response Store
  const {
    response,
    error,
    isSuccess,
    setResponse,
    setError,
    nativeFetchError,
    nativeFetchSuccess,
    reactQueryError,
    reactQuerySuccess,
    setNativeFetchError,
    setNativeFetchSuccess,
    setReactQueryError,
    setReactQuerySuccess,
  } = useResponseStore();
  console.log("Current error state from store:", error);
  console.log("Current response state from store:", response);
  console.log("Current isSuccess state from store:", isSuccess);

  // Alternative robust JSON cleaning function
  const cleanJsonStringRobust = (jsonString) => {
    if (!jsonString || typeof jsonString !== "string") return jsonString;

    const chars = jsonString.split("");
    const result = [];
    let inString = false;
    let inMultiLineComment = false;
    let inSingleLineComment = false;
    let stringChar = "";

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const nextChar = chars[i + 1] || "";
      const prevChar = chars[i - 1] || "";

      // Handle string state
      if (!inMultiLineComment && !inSingleLineComment) {
        if (!inString && (char === '"' || char === "'")) {
          inString = true;
          stringChar = char;
          result.push(char);
          continue;
        } else if (inString && char === stringChar && prevChar !== "\\") {
          inString = false;
          result.push(char);
          continue;
        } else if (inString) {
          result.push(char);
          continue;
        }
      }

      // Handle comments (only when not in string)
      if (!inString) {
        // Start of multi-line comment
        if (
          !inMultiLineComment &&
          !inSingleLineComment &&
          char === "/" &&
          nextChar === "*"
        ) {
          inMultiLineComment = true;
          i++; // Skip next char
          continue;
        }
        // End of multi-line comment
        if (inMultiLineComment && char === "*" && nextChar === "/") {
          inMultiLineComment = false;
          i++; // Skip next char
          continue;
        }
        // Start of single-line comment
        if (
          !inMultiLineComment &&
          !inSingleLineComment &&
          char === "/" &&
          nextChar === "/"
        ) {
          inSingleLineComment = true;
          i++; // Skip next char
          continue;
        }
        // End of single-line comment (end of line)
        if (inSingleLineComment && char === "\n") {
          inSingleLineComment = false;
          result.push(char);
          continue;
        }
        // Skip characters inside comments
        if (inMultiLineComment || inSingleLineComment) {
          continue;
        }
      }

      // Add non-comment characters
      if (!inMultiLineComment && !inSingleLineComment) {
        result.push(char);
      }
    }

    let cleaned = result.join("");

    // Clean up trailing commas
    cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");
    cleaned = cleaned.replace(/,(\s*})/g, "$1");

    // Remove excessive whitespace but preserve structure
    cleaned = cleaned.replace(/\s+/g, " ");
    cleaned = cleaned.replace(/\s*([{}[\]:,])\s*/g, "$1");

    return cleaned.trim();
  };

  // Function to clean JSON string by removing comments
  const cleanJsonString = (jsonString) => {
    // Try the robust method first
    try {
      return cleanJsonStringRobust(jsonString);
    } catch (error) {
      // Fallback to simpler method
      console.warn("Robust cleaning failed, using fallback method");
      let cleaned = jsonString.replace(/\/\*[\s\S]*?\*\//g, ""); // Remove /* */ comments
      cleaned = cleaned.replace(/\/\/.*$/gm, ""); // Remove // comments
      cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas
      return cleaned.trim();
    }
  };

  // Function to parse payload with comment cleaning
  const parsePayload = (payloadString) => {
    try {
      const cleaned = cleanJsonString(payloadString);
      console.log("Original payload:", payloadString);
      console.log("Cleaned payload:", cleaned);
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parsing error:", err.message);
      console.error(
        "Cleaned payload that failed:",
        cleanJsonString(payloadString)
      );
      throw new Error(`Invalid JSON payload: ${err.message}`);
    }
  };

  async function triggerApi() {
    console.log("Native fetch triggered with:", { endpoint, method, payload });

    // Clear previous Native Fetch state
    setResponse(null);
    setNativeFetchError(null);
    setNativeFetchSuccess(false);

    try {
      const headers = buildHeaders();
      console.log("Built headers:", headers);
      const requestOptions = {
        method: method,
        headers: headers,
      };

      // Add body for methods that need payload
      if (["POST", "PUT", "PATCH"].includes(method) && payload.trim()) {
        console.log("Payload before parsing:", payload);
        const parsedPayload = parsePayload(payload);
        requestOptions.body = JSON.stringify(parsedPayload);
        console.log("Parsed payload:", parsedPayload);
        console.log("Stringified body:", requestOptions.body);
      } else {
        console.log(
          "No payload added - method:",
          method,
          "payload empty:",
          !payload.trim()
        );
      }

      console.log("Request options:", requestOptions);
      console.log("Endpoint:", endpoint);
      console.log("Method:", method);
      const response = await fetch(endpoint, requestOptions);
      console.log(
        "Response status:",
        response.status,
        "Response ok:",
        response.ok
      );

      if (!response.ok) {
        console.log("Response NOT OK - entering error handling");
        let errorMessage = "An error occurred";
        try {
          const errorData = await response.json();
          console.log("Error response data:", errorData);
          errorMessage =
            errorData.detail ||
            errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`;
        } catch (parseError) {
          // If response isn't valid JSON, use status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        console.log("About to setNativeFetchError with:", {
          statusCode: response.status,
          message: errorMessage,
        });
        setNativeFetchError({
          statusCode: response.status,
          message: errorMessage,
        });
        console.log("Setting error in native fetch:", {
          statusCode: response.status,
          message: errorMessage,
        });
        setResponse(null);
        console.log("About to return from error handling");
        return;
      }

      console.log("Response OK - entering success handling");
      console.log("Native fetch: About to parse response as JSON");
      const data = await response.json();
      console.log("Native fetch: Successfully parsed JSON data:", data);
      setResponse(data);
      setNativeFetchSuccess(true);
      console.log("Native fetch: Success response set, error state cleared");
    } catch (err) {
      console.log("Caught error in native fetch:", err);
      let errorMessage = "Internal Server Error";
      let statusCode = 400;

      if (err.message.includes("Invalid JSON")) {
        errorMessage = err.message;
      } else if (err.message.includes("Failed to fetch")) {
        errorMessage = "Network error: Unable to reach the server";
        statusCode = 0;
      } else if (err.message.includes("NetworkError")) {
        errorMessage = "Network error occurred";
        statusCode = 0;
      } else if (err.name === "TypeError") {
        errorMessage = "Request failed: " + err.message;
        statusCode = 0;
      } else {
        errorMessage = err.message || "Unknown error occurred";
      }

      const errorObj = {
        statusCode: statusCode,
        message: errorMessage,
      };
      console.log("Setting error object:", errorObj);
      setNativeFetchError(errorObj);
      setResponse(null);
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      console.log("React Query triggered with:", { endpoint, method, payload });

      // Clear previous React Query state
      setResponse(null);
      setReactQueryError(null);
      setReactQuerySuccess(false);

      const headers = buildHeaders();
      console.log("React Query built headers:", headers);
      const requestOptions = {
        method: method,
        headers: headers,
      };

      // Add body for methods that need payload
      if (["POST", "PUT", "PATCH"].includes(method) && payload.trim()) {
        console.log("React Query payload before parsing:", payload);
        const parsedPayload = parsePayload(payload);
        requestOptions.body = JSON.stringify(parsedPayload);
        console.log("React Query parsed payload:", parsedPayload);
        console.log("React Query stringified body:", requestOptions.body);
      } else {
        console.log(
          "React Query no payload added - method:",
          method,
          "payload empty:",
          !payload.trim()
        );
      }

      console.log("React Query request options:", requestOptions);
      console.log("React Query endpoint:", endpoint);
      console.log("React Query method:", method);
      const response = await fetch(endpoint, requestOptions);
      console.log("React Query response status:", response.status);

      if (!response.ok) {
        let errorMessage = "An error occurred";
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.detail ||
            errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`;
        } catch (parseError) {
          // If response isn't valid JSON, use status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        const error = new Error(errorMessage);
        error.statusCode = response.status;
        throw error;
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("React Query onSuccess called with data:", data);
      setResponse(data);
      setReactQuerySuccess(true);
      console.log("React Query onSuccess completed, store should be updated");
    },
    onError: (error) => {
      console.error("React Query onError called with error:", error.message);
      setReactQueryError({
        statusCode: error.statusCode || 400,
        message: error.message,
      });
      setResponse(null);
      console.log("React Query onError completed, store should be updated");
    },
  });

  function triggerApiWithQuery() {
    console.log("triggerApiWithQuery called, mutation state:", {
      isPending: mutation.isPending,
      isError: mutation.isError,
      isSuccess: mutation.isSuccess,
      data: mutation.data,
      error: mutation.error,
    });
    mutation.mutate();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: "32px",
            borderBottom: "3px solid #000000",
            paddingBottom: "16px",
          }}
        >
          <h1
            style={{
              margin: "0",
              fontSize: "32px",
              fontWeight: "700",
              color: "#000000",
            }}
          >
            API Sandbox
          </h1>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "16px",
              color: "#666666",
              fontWeight: "400",
            }}
          >
            Test and debug your API endpoints with ease
          </p>
        </header>

        <ApiConfig
          endpoint={endpoint}
          setEndpoint={setEndpoint}
          method={method}
          setMethod={setMethod}
          payload={payload}
          setPayload={setPayload}
          contentType={contentType}
          setContentType={setContentType}
          authEnabled={authEnabled}
          setAuthEnabled={setAuthEnabled}
          authType={authType}
          setAuthType={setAuthType}
          authValue={authValue}
          setAuthValue={setAuthValue}
        />

        <ResponseDisplay response={response} />

        <ApiTester
          triggerApi={triggerApi}
          triggerApiWithQuery={triggerApiWithQuery}
          nativeFetchError={nativeFetchError}
          nativeFetchSuccess={nativeFetchSuccess}
          reactQueryError={reactQueryError}
          reactQuerySuccess={reactQuerySuccess}
          mutation={mutation}
        />
      </div>
    </div>
  );
}

export default App;

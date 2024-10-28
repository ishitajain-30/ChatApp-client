import { useState, useRef } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import logo from "./images/Logo.png";
import user from "./images/User.png";
import ai from "./images/AI.png";

export default function Component() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const fileInputRef = useRef(null);

  // Function to upload PDF file to the backend
  const uploadPDF = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await fetch(
        "https://chatapp-server-4dw4.onrender.com/upload-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("PDF uploaded successfully.");
      } else {
        alert("Failed to upload PDF.");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      uploadPDF(selectedFile); // Automatically upload the file
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  // Trigger file input dialog on button click
  const handleChoosePDFClick = () => {
    fileInputRef.current.click();
  };

  const sendMessage = async () => {
    if (!message) {
      alert("Please enter a message.");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("query", message); // Append your data as key-value pairs

    try {
      const response = await fetch(
        "https://chatapp-server-4dw4.onrender.com/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Set content type to x-www-form-urlencoded
          },
          body: formData.toString(), // Convert to string
        }
      );

      if (!response.ok) {
        console.error("Error: Response status is not OK", response.status);
        alert("Failed to get a response from the server.");
        return;
      }

      const data = await response.json();
      console.log("Received response data:", data); // Log response for debugging

      if (data && data.answer) {
        // Update chat history with user's message and bot's answer
        setChatHistory((prev) => [
          ...prev,
          { user: message, bot: data.answer },
        ]);
        setMessage(""); // Clear the input field
      } else {
        alert("The server responded but did not return an answer.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert(
        "An error occurred while sending your message. Check the console for details."
      );
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen w-full bg-secondary-foreground ">
      <nav>
        <div className="flex flex-row justify-between px-2 shadow">
          <div className="flex h-[60px] items-center px-2">
            <img src={logo} alt="Logo" className="h-10" />
          </div>

          {/* Choose PDF section */}
          <div className="flex items-center gap-2">
            <span className="text-secondary">{fileName}</span>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              onClick={handleChoosePDFClick}
              className="flex items-center gap-2 rounded-lg border px-2 py-1 text-secondary"
            >
              <PlusIcon className="h-4 w-4" />
              Choose PDF
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-auto p-4 sm:p-6 w-full max-w-full justify-center">
        <div className="grid gap-4">
          {chatHistory.map((chat, index) => (
            <div key={index}>
              <div className="flex items-start gap-4">
                <div className="flex space-x-2 rounded-lg bg-primary p-3 text-sm text-primary-foreground items-center">
                  <img src={user} alt="user" className="h-7" />
                  <div>{chat.user}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex space-x-2 rounded-lg bg-primary text-primary-foreground p-3 text-sm items-start">
                  <img src={ai} alt="ai" className="h-7" />
                  <div>{chat.bot}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center p-5">
        <div className="sticky bottom-2 z-10 flex h-16 items-center gap-2  rounded-lg px-4 sm:px-6 w-full   ">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg bg-[#E4E8EE] px-4 py-2 text-sm text-black focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button onClick={sendMessage} className="h-10 px-4 text-sm border">
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

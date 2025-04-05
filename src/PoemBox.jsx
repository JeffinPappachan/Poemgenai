import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import "./PoemBox.css";

export default function PoemBox() {
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState(
    "Write a short and inspiring poem about the beauty of nature."
  );
  const [cache, setCache] = useState({});
  const [savedPoems, setSavedPoems] = useState([]); // State to store saved poems

  // Function to fetch a poem from the API
  async function fetchPoem() {
    if (cache[prompt]) {
      setResponse(cache[prompt]);
      return;
    }

    try {
      const apiKey = "AIzaSyBsYfncrMKkQqfeTk10NMjaj9buiOGVboI";
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setResponse(text);
      setCache({ ...cache, [prompt]: text }); // Cache the response
    } catch (err) {
      if (err.message.includes("429")) {
        setError("Rate limit exceeded. Please wait and try again.");
      } else {
        setError(err.message);
      }
    }
  }

  // Function to save the generated poem
  function savePoem() {
    if (response && !savedPoems.includes(response)) {
      setSavedPoems([...savedPoems, response]); // Add the current poem to the saved poems list
    }
  }

  // Function to delete a saved poem
  function deletePoem(index) {
    const updatedPoems = savedPoems.filter((_, i) => i !== index); // Remove the poem at the given index
    setSavedPoems(updatedPoems);
  }

  return (
    <div className="poem-box">
      <h1 className="poem-title">AI Poem Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your poem style or topic"
        className="poem-input"
      />
      <div className="poem-buttons">
        <button onClick={fetchPoem} className="poem-button">
          Generate Poem
        </button>
        <button
          onClick={savePoem}
          className="poem-button save-button"
          disabled={!response || savedPoems.includes(response)} // Disable if the poem is already saved
        >
          Save Poem
        </button>
      </div>
      {error ? (
        <p className="poem-error">{error}</p>
      ) : (
        <div className="poem-response">
          {response
            .split("\n") // Split the poem into lines
            .map((line, index) => (
              <p key={index} className="poem-line">
                {line}
              </p>
            ))}
        </div>
      )}
      <h3 className="saved-poems-title">Saved Poems:</h3>
      <ul className="saved-poems-list">
        {savedPoems.map((poem, index) => (
          <li key={index} className="saved-poem-item">
            {/* Add the number outside the box */}
            <div className="poem-number-container">
              <span className="poem-number">{index + 1}.</span>
            </div>
            {/* Display the poem content line by line */}
            <div className="poem-content">
              {poem.split("\n").map((line, lineIndex) => (
                <div key={lineIndex} className="poem-line">
                  {line}
                </div>
              ))}
            </div>
            {/* Delete button */}
            <button onClick={() => deletePoem(index)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


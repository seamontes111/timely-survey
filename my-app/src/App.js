import { useState, useEffect } from "react";

export default function App() {
  const browsers = ["Edge", "Firefox", "Chrome", "Opera", "Brave", "Vivaldi"];

  const [showSurvey, setShowSurvey] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Survey state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [browser, setBrowser] = useState("");

  // Stores all survey submissions
  const [votes, setVotes] = useState([]);

  const [message, setMessage] = useState("");


  // Submit handler
  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("votes")) || [];
  setVotes(saved);
}, []);

useEffect(() => {
  localStorage.setItem("votes", JSON.stringify(votes));
}, [votes]);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!name || !email || !browser) {
    alert("Please complete all fields.");
    return;
  }

  const emailExists = votes.some((v) => v.email === email);

  // Remove previous submission for this email
  const filteredVotes = votes.filter((v) => v.email !== email);

  // Add new submission
  const newVotes = [...filteredVotes, { name, email, browser }];
  setVotes(newVotes);

  // Save to local storage
  localStorage.setItem("votes", JSON.stringify(newVotes));

  // Show message based on new or updated submission
  if (emailExists) {
    setMessage("Submission updated.");
  } else {
    setMessage("Submission recorded.");
  }

  setShowSurvey(false);
  setShowResults(true);

  // Clear form fields
  setName("");
  setEmail("");
  setBrowser("");
};

  const getBrowserCounts = () => {
    const counts = {};
    browsers.forEach((b) => (counts[b] = 0));
    votes.forEach((v) => counts[v.browser]++);
    return counts;
  };

  const counts = getBrowserCounts();
  const totalVotes = votes.length;

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Timely Browser Survey</h1>

      {/* 1. Button to open survey */}
      {!showSurvey && !showResults && (
        <button
          onClick={() => setShowSurvey(true)}
          style={{ padding: "10px 20px", fontSize: 16 }}
        >
          Take the Survey
        </button>
      )}

      {/* 2. Survey Form */}
      {showSurvey && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 350
          }}
        >
          <h2>Browser Survey</h2>

          <label>
            Name (required)
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label>
            Email (required)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label>
            Choose your preferred browser (required)
            <select
              value={browser}
              onChange={(e) => setBrowser(e.target.value)}
              required
              style={{ width: "100%", padding: 8 }}
            >
              <option value="">Select…</option>
              {browsers.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" style={{ padding: "10px 20px", fontSize: 16 }}>
            Submit
          </button>
        </form>
      )}

      {/* 3. Results Table */}
      {message && (
  <p style={{ fontWeight: "bold", color: "green" }}>{message}</p>
)}

      {showResults && (
        <div style={{ marginTop: 30 }}>
          <h2>Survey Results</h2>
          {totalVotes === 0 ? (
            <p>No results yet.</p>
          ) : (
            <table
              border="1"
              cellPadding="8"
              style={{ borderCollapse: "collapse", minWidth: 350 }}
            >
              <thead>
                <tr>
                  <th>Browser</th>
                  <th>Votes</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {browsers.map((b) => (
                  <tr key={b}>
                    <td>{b}</td>
                    <td>{counts[b]}</td>
                    <td>
                      {totalVotes > 0
                        ? ((counts[b] / totalVotes) * 100).toFixed(1) + "%"
                        : "0%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button
            onClick={() => setShowSurvey(true)}
            style={{ marginTop: 20, padding: "10px 20px" }}
          >
            Take Survey Again
          </button>
        </div>
      )}
    </div>
  );
}
 

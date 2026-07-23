import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    age: 35,
    job: "management",
    marital: "married",
    education: "tertiary",
    default: "no",
    balance: 1500,
    housing: "yes",
    loan: "no",
    contact: "cellular",
    day: 10,
    month: "may",
    duration: 300,
    campaign: 2,
    pdays: -1,
    previous: 0,
    poutcome: "unknown",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: [
        "age",
        "balance",
        "day",
        "duration",
        "campaign",
        "pdays",
        "previous",
      ].includes(name)
        ? Number(value)
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      setError(
        "Could not connect to the prediction server. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Bank Marketing Predictor</h1>
        <p>
          Predict whether a customer is likely to subscribe to a term deposit.
        </p>
      </header>

      <main className="container">
        <form onSubmit={handleSubmit} className="form-card">
          <h2>Customer Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Job</label>
              <select
                name="job"
                value={formData.job}
                onChange={handleChange}
              >
                <option value="admin.">Admin</option>
                <option value="blue-collar">Blue Collar</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="housemaid">Housemaid</option>
                <option value="management">Management</option>
                <option value="retired">Retired</option>
                <option value="self-employed">Self Employed</option>
                <option value="services">Services</option>
                <option value="student">Student</option>
                <option value="technician">Technician</option>
                <option value="unemployed">Unemployed</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div className="form-group">
              <label>Marital Status</label>
              <select
                name="marital"
                value={formData.marital}
                onChange={handleChange}
              >
                <option value="married">Married</option>
                <option value="single">Single</option>
                <option value="divorced">Divorced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Education</label>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="tertiary">Tertiary</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div className="form-group">
              <label>Account Balance</label>
              <input
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Default</label>
              <select
                name="default"
                value={formData.default}
                onChange={handleChange}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Housing Loan</label>
              <select
                name="housing"
                value={formData.housing}
                onChange={handleChange}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Personal Loan</label>
              <select
                name="loan"
                value={formData.loan}
                onChange={handleChange}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Contact Method</label>
              <select
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              >
                <option value="cellular">Cellular</option>
                <option value="telephone">Telephone</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div className="form-group">
              <label>Day of Contact</label>
              <input
                type="number"
                name="day"
                value={formData.day}
                onChange={handleChange}
                min="1"
                max="31"
              />
            </div>

            <div className="form-group">
              <label>Month</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
              >
                <option value="jan">January</option>
                <option value="feb">February</option>
                <option value="mar">March</option>
                <option value="apr">April</option>
                <option value="may">May</option>
                <option value="jun">June</option>
                <option value="jul">July</option>
                <option value="aug">August</option>
                <option value="sep">September</option>
                <option value="oct">October</option>
                <option value="nov">November</option>
                <option value="dec">December</option>
              </select>
            </div>

            <div className="form-group">
              <label>Call Duration (seconds)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Campaign Contacts</label>
              <input
                type="number"
                name="campaign"
                value={formData.campaign}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Days Since Previous Contact</label>
              <input
                type="number"
                name="pdays"
                value={formData.pdays}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Previous Contacts</label>
              <input
                type="number"
                name="previous"
                value={formData.previous}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Previous Campaign Outcome</label>
              <select
                name="poutcome"
                value={formData.poutcome}
                onChange={handleChange}
              >
                <option value="unknown">Unknown</option>
                <option value="failure">Failure</option>
                <option value="other">Other</option>
                <option value="success">Success</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict Subscription"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {result && (
          <div
            className={`result-card ${
              result.prediction === 1 ? "positive" : "negative"
            }`}
          >
            <h2>Prediction Result</h2>

            <div className="result-icon">
              {result.prediction === 1 ? "✓" : "×"}
            </div>

            <h3>{result.result}</h3>

            <p>
              Estimated probability of subscription:
            </p>

            <div className="probability">
              {(result.probability * 100).toFixed(1)}%
            </div>

            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${result.probability * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
import { useState } from "react";
import "./App.css";

function App() {
  const [role, setRole] = useState("freelancer");

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <span>✦</span> StellarWork
        </div>

        <div className="nav-links">
          <a href="#jobs">Jobs</a>
          <a href="#how">How it works</a>
          <a href="#about">About</a>
        </div>

        <button className="wallet-btn">
          Connect Wallet
        </button>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="badge">
              ✦ Built on Stellar
            </div>

            <h1>
              Freelance work.
              <br />
              <span>Verified & paid.</span>
            </h1>

            <p>
              AI-verified freelance work with secure Stellar
              payments. Complete jobs, verify your work, and
              get paid without unnecessary intermediaries.
            </p>

            <div className="hero-actions">
              <button className="primary-btn">
                Find Work →
              </button>

              <button className="secondary-btn">
                Post a Job
              </button>
            </div>

            <div className="stats">
              <div>
                <strong>100%</strong>
                <small>On-chain payments</small>
              </div>

              <div>
                <strong>AI</strong>
                <small>Work verification</small>
              </div>

              <div>
                <strong>24/7</strong>
                <small>Payment escrow</small>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-header">
              <span>Active Job</span>
              <span className="status">● In Progress</span>
            </div>

            <h3>Build a React Dashboard</h3>

            <p>
              Create a responsive dashboard for a
              blockchain application.
            </p>

            <div className="job-info">
              <div>
                <small>Budget</small>
                <strong>250 XLM</strong>
              </div>

              <div>
                <small>Deadline</small>
                <strong>3 days</strong>
              </div>
            </div>

            <div className="verification">
              <span>✓</span>
              AI verification enabled
            </div>

            <button className="card-btn">
              View Job
            </button>
          </div>
        </section>

        <section id="jobs" className="jobs-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WORK MARKETPLACE</span>
              <h2>Find verified opportunities</h2>
            </div>

            <button className="outline-btn">
              View all jobs →
            </button>
          </div>

          <div className="job-grid">
            <JobCard
              title="Build a React Dashboard"
              category="Frontend"
              budget="250 XLM"
              time="3 days"
            />

            <JobCard
              title="Smart Contract Integration"
              category="Blockchain"
              budget="500 XLM"
              time="5 days"
            />

            <JobCard
              title="Landing Page Design"
              category="Design"
              budget="180 XLM"
              time="2 days"
            />
          </div>
        </section>

        <section id="how" className="how-section">
          <span className="eyebrow">SIMPLE PROCESS</span>
          <h2>Work. Verify. Get paid.</h2>

          <div className="steps">
            <Step
              number="01"
              title="Find or post a job"
              text="Connect your Stellar wallet and find opportunities that match your skills."
            />

            <Step
              number="02"
              title="Complete the work"
              text="Submit your completed work through the platform."
            />

            <Step
              number="03"
              title="AI verification"
              text="AI-assisted verification checks the submitted work against the job requirements."
            />

            <Step
              number="04"
              title="Get paid"
              text="Once verified, the escrow releases the Stellar payment."
            />
          </div>
        </section>

        <section className="role-section">
          <span className="eyebrow">GET STARTED</span>
          <h2>What are you looking for?</h2>

          <div className="role-switch">
            <button
              className={role === "freelancer" ? "active" : ""}
              onClick={() => setRole("freelancer")}
            >
              I'm a Freelancer
            </button>

            <button
              className={role === "client" ? "active" : ""}
              onClick={() => setRole("client")}
            >
              I'm a Client
            </button>
          </div>

          <p>
            {role === "freelancer"
              ? "Find verified jobs, complete work and receive secure Stellar payments."
              : "Post jobs, fund escrow and pay freelancers after successful verification."}
          </p>
        </section>
      </main>

      <footer>
        <div className="logo">
          <span>✦</span> StellarWork
        </div>

        <p>
          AI-verified freelance payments powered by Stellar.
        </p>
      </footer>
    </div>
  );
}

function JobCard({ title, category, budget, time }) {
  return (
    <div className="job-card">
      <div className="job-top">
        <span className="category">{category}</span>
        <span className="verified">✓ Verified</span>
      </div>

      <h3>{title}</h3>

      <div className="job-details">
        <span>💰 {budget}</span>
        <span>◷ {time}</span>
      </div>

      <button className="view-btn">
        View details →
      </button>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="step">
      <span className="step-number">{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default App;
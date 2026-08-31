import { useEffect, useState } from 'react'
import {
  connectWallet,
  signWalletTransaction,
} from './stellar/wallet'

import {
  getJob,
  submitWork,
  verifyJob,
  createJob,
} from './stellar/client'

import './App.css'

function App() {
  const [wallet, setWallet] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')
  const [job, setJob] = useState(null)
  const [escrow, setEscrow] = useState(null)
  const [showPostJob, setShowPostJob] = useState(false)

  const [jobForm, setJobForm] = useState({
    amount: '250',
    requirements: 'Build a React Dashboard',
    deadlineDays: '3',
  })

  const [creatingJob, setCreatingJob] = useState(false)
  const [jobMessage, setJobMessage] = useState('')
  const [submittingWork, setSubmittingWork] = useState(false)

  useEffect(() => {
    async function loadJob() {
      try {
        const result = await getJob()
        console.log('INITIAL JOB FROM CHAIN:', result)
        setJob(result)
      } catch (err) {
        console.error('Failed to load job:', err)
      }
    }

    loadJob()
  }, [])

  async function handleCreateJob(event) {
    event.preventDefault()

    if (!wallet) {
      setError('Please connect your wallet first.')
      return
    }

    setCreatingJob(true)
    setJobMessage('')
    setError('')

    try {
      const deadline = Math.floor(
        Date.now() / 1000 +
          Number(jobForm.deadlineDays) * 24 * 60 * 60
      )

      const result = await createJob({
        walletAddress: wallet.address,
        amount: jobForm.amount,
        freelancerAddress: wallet.address,
        requirements: jobForm.requirements,
        deadline,
        signTransaction: signWalletTransaction,
      })

      console.log('CREATE JOB TRANSACTION:', result)

      setJobMessage(
        result.hash
          ? `Transaction submitted: ${result.hash}`
          : `Transaction status: ${result.status}`
      )

      setShowPostJob(false)

      // Refresh job after creation
      setTimeout(async () => {
       try {
  const updatedJob = await getJob()
  console.log('UPDATED JOB FROM CHAIN:', updatedJob)
  setJob(updatedJob)
} catch (refreshError) {
  console.warn('Could not refresh job:', refreshError)
}
      }, 3000)
    } catch (err) {
      console.error('CREATE JOB ERROR:', err)
      setError(err.message || 'Failed to create job')
    } finally {
      setCreatingJob(false)
    }
  }

  async function handleConnect() {
    setConnecting(true)
    setError('')

    try {
      const result = await connectWallet()
      console.log('CONNECTED WALLET:', result)
      setWallet(result)
    } catch (err) {
      console.error('CONNECT ERROR:', err)
      setError(err.message || 'Unable to connect wallet')
    } finally {
      setConnecting(false)
    }
  }

  async function handleSubmitWork() {
    console.log('SUBMIT BUTTON CLICKED')

    if (!wallet) {
      setError('Please connect your wallet first.')
      return
    }

    try {
      setSubmittingWork(true)
      setError('')
      setJobMessage('Submitting work...')

      // STEP 1: Submit work
      const result = await submitWork({
        walletAddress: wallet.address,
        submissionHash: 'test-submission-001',
        signTransaction: signWalletTransaction,
      })

      console.log('SUBMIT TRANSACTION:', result)

      setJobMessage(
        result.hash
          ? `Work submitted: ${result.hash}`
          : `Work status: ${result.status}`
      )

      // STEP 2: Verify work
      const verificationResult = await verifyJob({
        walletAddress: wallet.address,
        verificationResult: true,
        signTransaction: signWalletTransaction,
      })

      console.log('VERIFY TRANSACTION:', verificationResult)

      setJobMessage(
        verificationResult.hash
          ? `Work submitted and verified: ${verificationResult.hash}`
          : 'Work submitted and verified successfully'
      )

      // STEP 3: Refresh job from blockchain
      

      try {
        const updatedJob = await getJob()

        console.log('UPDATED JOB FROM CHAIN:', updatedJob)
console.log('VERIFIED FIELD:', updatedJob?.verified)
console.log('VERIFICATION RESULT:', updatedJob?.verification_result)

setJob(updatedJob)
      } catch (refreshError) {
        console.warn(
          'Could not refresh job:',
          refreshError
        )
      }
    } catch (err) {
      console.error(
        'SUBMIT/VERIFY ERROR:',
        err
      )

      setError(
        err.message ||
          'Submit work failed'
      )
    } finally {
      setSubmittingWork(false)
    }
  }

  return (
    <div className="app">

      <header className="navbar">

        <div className="logo">
          ✦ StellarWork
        </div>

        <nav>
          <a href="#jobs">Jobs</a>
          <a href="#how">How it works</a>
          <a href="#about">About</a>
        </nav>

        <button
          className="wallet-btn"
          onClick={handleConnect}
        >
          {connecting
            ? 'Connecting...'
            : wallet
              ? `${wallet.address.slice(
                  0,
                  6
                )}...${wallet.address.slice(-4)}`
              : 'Connect Wallet'}
        </button>

      </header>

      {error && (
        <div className="wallet-error">
          {error}
        </div>
      )}

      {jobMessage && (
        <div className="wallet-success">
          {jobMessage}
        </div>
      )}

      <main>

        <section className="hero">

          <div className="hero-content">

            <span className="eyebrow">
              ✦ Built on Stellar
            </span>

            <h1>
              Freelance work.
              <br />
              <span>Verified & paid.</span>
            </h1>

            <p>
              AI-verified freelance work with secure
              Stellar payments. Complete jobs, verify
              your work, and get paid without unnecessary
              intermediaries.
            </p>

            <div className="hero-actions">

              <a
                href="#jobs"
                className="primary-btn"
              >
                Find Work →
              </a>

              <button
                className="secondary-btn"
                onClick={() => {
                  setShowPostJob(true)
                  setError('')
                  setJobMessage('')
                }}
              >
                Post a Job
              </button>

            </div>

            <div className="stats">

              <div>
                <strong>100%</strong>
                <span>On-chain payments</span>
              </div>

              <div>
                <strong>AI</strong>
                <span>Work verification</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Payment escrow</span>
              </div>

            </div>

          </div>

          <div className="job-card">

            <div className="card-top">

              <span>Active Job</span>

              <span className="status">
                ● In Progress
              </span>

            </div>

            <h3>
              {job
                ? job.requirements
                : 'Loading job...'}
            </h3>

            <p>
              {job
                ? 'Verified freelance job stored on the Stellar Testnet.'
                : 'Loading job data from Stellar...'}
            </p>

            <div className="job-details">

              <div>
                <span>Budget</span>

                <strong>
                  {job
                    ? `${job.amount} XLM`
                    : 'Loading...'}
                </strong>
              </div>

              <div>
                <span>Deadline</span>

                <strong>
                  {job
                    ? `${job.deadline}`
                    : 'Loading...'}
                </strong>
              </div>

            </div>

            <div className="verified">
              ✓ AI verification enabled
            </div>

            <button
              className="view-btn"
              onClick={() => {

                if (!job) {
                  alert(
                    'Job data is still loading'
                  )
                  return
                }

                alert(
                  `ON-CHAIN JOB

Requirements: ${
                    job.requirements ?? 'Loading'
                  }

Budget: ${
                    job.amount ?? 'Loading'
                  } XLM

Deadline: ${
                    job.deadline ?? 'Loading'
                  }

Verified: ${
                    job.verified ?? 'Loading'
                  }

Verification Result: ${
                    job.verification_result ??
                    'Loading'
                  }

Escrow Status: ${
                    escrow?.status ??
                    'Loading'
                  }`
                )
              }}
            >
              View Job
            </button>

            {/* ONLY ONE SUBMIT BUTTON */}
            <button
              className="primary-btn"
              onClick={handleSubmitWork}
              disabled={submittingWork}
            >
              {submittingWork
                ? 'Submitting...'
                : 'Submit Work'}
            </button>

          </div>

        </section>

        {showPostJob && (

          <section className="post-job-section">

            <div className="post-job-card">

              <div className="section-heading">

                <div>

                  <span className="section-label">
                    CREATE JOB
                  </span>

                  <h2>
                    Post a new job
                  </h2>

                </div>

                <button
                  className="close-btn"
                  onClick={() =>
                    setShowPostJob(false)
                  }
                >
                  Close
                </button>

              </div>

              <form
                onSubmit={handleCreateJob}
                className="job-form"
              >

                <label>
                  Budget (XLM)

                  <input
                    type="number"
                    min="1"
                    value={jobForm.amount}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        amount: e.target.value,
                      })
                    }
                    required
                  />

                </label>

                <label>
                  Requirements

                  <input
                    type="text"
                    value={jobForm.requirements}
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        requirements:
                          e.target.value,
                      })
                    }
                    required
                  />

                </label>

                <label>
                  Deadline (days)

                  <input
                    type="number"
                    min="1"
                    value={
                      jobForm.deadlineDays
                    }
                    onChange={(e) =>
                      setJobForm({
                        ...jobForm,
                        deadlineDays:
                          e.target.value,
                      })
                    }
                    required
                  />

                </label>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={creatingJob}
                >
                  {creatingJob
                    ? 'Creating job...'
                    : 'Create Job on Stellar'}
                </button>

              </form>

            </div>

          </section>

        )}

        <section
          id="jobs"
          className="jobs-section"
        >

          <span className="section-label">
            WORK MARKETPLACE
          </span>

          <div className="section-heading">

            <h2>
              Find verified opportunities
            </h2>

            <a href="#jobs">
              View all jobs →
            </a>

          </div>

          <div className="jobs-grid">

            <JobCard
              category="Frontend"
              title="Build a React Dashboard"
              budget="250 XLM"
              deadline="3 days"
            />

            <JobCard
              category="Blockchain"
              title="Smart Contract Integration"
              budget="500 XLM"
              deadline="5 days"
            />

            <JobCard
              category="Design"
              title="Landing Page Design"
              budget="180 XLM"
              deadline="2 days"
            />

          </div>

        </section>

        <section
          id="how"
          className="process-section"
        >

          <span className="section-label">
            SIMPLE PROCESS
          </span>

          <h2>
            Work. Verify. Get paid.
          </h2>

          <div className="process-grid">

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

        <section className="cta-section">

          <span className="section-label">
            GET STARTED
          </span>

          <h2>
            What are you looking for?
          </h2>

          <div className="role-buttons">

            <button onClick={handleConnect}>
              I'm a Freelancer
            </button>

            <button onClick={handleConnect}>
              I'm a Client
            </button>

          </div>

          <p>
            Find verified jobs, complete work and
            receive secure Stellar payments.
          </p>

        </section>

      </main>

      <footer id="about">

        <div className="logo">
          ✦ StellarWork
        </div>

        <p>
          AI-verified freelance payments powered
          by Stellar.
        </p>

      </footer>

    </div>
  )
}

function JobCard({
  category,
  title,
  budget,
  deadline,
}) {
  return (
    <article className="market-card">

      <div className="category">

        {category}

        <span>
          ✓ Verified
        </span>

      </div>

      <h3>
        {title}
      </h3>

      <div className="market-meta">

        <span>
          💰 {budget}
        </span>

        <span>
          ◷ {deadline}
        </span>

      </div>

      <button
        onClick={() =>
          alert(
            `JOB DETAILS

Category: ${category}

Job: ${title}

Budget: ${budget}

Deadline: ${deadline}

Status: Verified`
          )
        }
      >
        View details →
      </button>

    </article>
  )
}

function Step({
  number,
  title,
  text,
}) {
  return (
    <article className="step">

      <span>
        {number}
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </article>
  )
}

export default App

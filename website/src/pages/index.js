import React from "react"
import { Link } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/SEO"

const Home = () => (
  <Layout>
    <SEO title="React Form Hooks Documentation" />

    <div className="hero hero-sm text-center">
      <div className="hero-body">
        <h1>React Form Hooks</h1>
        <p>React hooks for form state management using subscriptions.</p>
        <Link to="/getting-started" className="btn btn-primary">
          Getting Started
        </Link>{' '}
        <Link to="/api" className="btn btn-primary">
          API
        </Link>{' '}
        <Link to="/examples" className="btn btn-primary">
          Examples
        </Link>
      </div>
    </div>

  </Layout>
)

export default Home

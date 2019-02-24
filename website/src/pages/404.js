import React from "react"
import { Link } from "gatsby"

import Layout from "../components/Layout"
import SEO from "../components/SEO"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404 | React Form Hooks Documentation" />

    <div className="empty">
      <p className="empty-title h5">404</p>
      <p className="empty-subtitle">Page not found.</p>
      <div className="empty-action">
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  </Layout>
)

export default NotFoundPage

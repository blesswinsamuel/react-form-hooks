const path = require('path')

module.exports = {
  siteMetadata: {
    title: `React Form Hooks Docs`,
    description: `Form library using React hooks and subscriptions.`,
    author: `Blesswin Samuel`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-135355751-1",
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: path.join(__dirname, '..', 'docs'),
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        // CommonMark mode (default: true)
        commonmark: true,
        // Footnotes mode (default: true)
        footnotes: true,
        // Pedantic mode (default: true)
        pedantic: true,
        // GitHub Flavored Markdown mode (default: true)
        gfm: true,
        // Plugins configs
        plugins: [
          `gatsby-remark-autolink-headers`,
          {
            resolve: "gatsby-remark-embed-snippet",
            options: {
              classPrefix: "code language-",
              directory: `${__dirname}/src/`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'code language-',
              aliases: {},
              noInlineHighlight: true,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `react-form-hooks`,
        short_name: `react-form-hooks`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        // icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
  ],
}

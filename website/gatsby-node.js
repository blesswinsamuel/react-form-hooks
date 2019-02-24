const { examples } = require('./menu')
const path = require('path')

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const docTemplate = path.resolve(`src/templates/DocTemplate.js`)
  const exampleTemplate = path.resolve(`src/templates/ExampleTemplate.js`)

  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)
  if (result.errors) {
    return Promise.reject(result.errors)
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: docTemplate,
      context: {}, // additional data can be passed via context
    })
  })

  examples.forEach(example => {
    createPage({
      path: example.link,
      component: exampleTemplate,
      context: { title: example.text, Component: null, code: null },
    })
  })
}

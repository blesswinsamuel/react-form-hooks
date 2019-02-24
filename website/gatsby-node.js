const path = require('path')

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  {
    const result = await graphql(`
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              fileAbsolutePath
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

    const template = {
      docs: path.resolve(`src/templates/DocTemplate.js`),
      examples: path.resolve(`src/templates/ExampleTemplate.js`),
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component:
          template[path.basename(path.dirname(node.fileAbsolutePath))],
        context: {}, // additional data can be passed via context
      })
    })
  }
}

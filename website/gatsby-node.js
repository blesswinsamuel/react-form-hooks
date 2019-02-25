const path = require('path')

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  {
    const result = await graphql(`
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              fields { parentDir }
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
      recipes: path.resolve(`src/templates/RecipeTemplate.js`),
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: template[node.fields.parentDir],
        context: {}, // additional data can be passed via context
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const parent = getNode(node.parent)

    createNodeField({
      name: 'sourceInstanceName',
      node,
      value: parent.sourceInstanceName,
    })

    createNodeField({
      name: 'parentDir',
      node,
      value: path.basename(path.dirname(node.fileAbsolutePath)),
    })
  }
}

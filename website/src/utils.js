export const getMenu = menu => {
  if (!menu) return null
  return menu.edges.map(item => {
    return {
      link: item.node.frontmatter.path,
      text: item.node.frontmatter.title,
    }
  })
}

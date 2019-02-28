import React from 'react'
import { Link } from 'gatsby'
import { OutboundLink } from 'gatsby-plugin-google-analytics'

const renderLink = item => {
  if (item.link) {
    return <Link to={item.link}>{item.text}</Link>
  } else if (item.href) {
    return (
      <OutboundLink target="_blank" rel="noopener noreferrer" href={item.href}>
        {item.text}
      </OutboundLink>
    )
  } else {
    return <div className="text-uppercase text-bold">{item.text}</div>
  }
}

export default function Nav({ menu }) {
  return (
    <ul className="nav">
      {menu.map((item, i) => (
        <li key={i} className="nav-item">
          {renderLink(item)}
          {item.children && <Nav menu={item.children} />}
        </li>
      ))}
    </ul>
  )
}

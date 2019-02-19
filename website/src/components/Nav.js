import React from 'react'

export default function Nav({ menu }) {
  return (
    <ul className="nav">
      {menu.map(item => (
        <li key={item.link} className="nav-item">
          <a href={item.link}>{item.text}</a>
          {item.children && <Nav menu={item.children} />}
        </li>
      ))}
    </ul>
  )
}

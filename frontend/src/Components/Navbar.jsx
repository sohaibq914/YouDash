import React, { useState } from "react";

import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <Link to="/" className="title">
        YouDash
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/block-categories">Block Categories</NavLink>
        </li>
        <li>
          <NavLink id="goalsCreate" to="/goalsCreate">Create Goals</NavLink>
        </li>
        <li>
          <NavLink id="goalsView" to="/goalsView">View Goals</NavLink>
        </li>
        <li>
          <NavLink id="goalsEdit" to="/goalsEdit">Edit Goals</NavLink>
        </li>
        <li>
          <NavLink id="goalsVis" to="/goalsVis">Visualize Goals</NavLink>
        </li>
        <li>
          <NavLink to="/profile">Profile</NavLink>
        </li>
      </ul>
    </nav>
  );
};

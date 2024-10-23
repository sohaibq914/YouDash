import React from "react";

export default function Item({ row }) {
  return (
    <li className="item">
      <span className="item__name">{row.username}</span>
      <span className="item__watchTime">{row.watchTime} min</span> {/* Change from score to watchTime */}
      {/* <span className="hi">hi</span> */}
    </li>
  );
}

import React from "react";
import "./BlockedPages.css";


const BlockedPages = () => {
  return (
    //header for currently blocked and category block
    <div>
      <h1 className="CategoryBlockTitle">Category Block</h1>
      <h1 className="CurrentlyBlockedTitle">Currently Blocked</h1>
      {/*// main screen container for Blocked Page */}
      <div className="container">
        {/* rectangle container for Currently Blocked */}
        <div className="CurrentlyBlockedCategoriesContainer">
          <div className="CategoriesRectangleTitle">
            <h1>Categories</h1>
          </div>
        </div>

        {/* a rectangle container for Blocking Categories */}
        <div className="AddCategoriesContainer">
          {/* Header for container(Category and Search function)*/}
          <div className="AddCategoriesContainerHeader">
            <h1>Categories</h1>
            <h2>Search:</h2>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ width: "165px" }}
                
              >
                Dropdown button
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item">Action</a>
                </li>
                <li>
                  <a className="dropdown-item">Another action</a>
                </li>
                <li>
                  <a className="dropdown-item">Something else here</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* // end of main screen container */}
    </div> //end header for currently blocked and category block
  );
};

export default BlockedPages;

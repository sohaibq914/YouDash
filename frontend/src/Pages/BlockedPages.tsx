import React from "react";
import "./BlockedPages.css";


const BlockedPages = () => {
  return (
    //header for currently blocked and category block
    <div>

      <div className="CategoryBlockTitle">
        <h1>Category Block</h1>
      </div>

      <div className="CurrentlyBlockedTitle">
            <h1>Currently Blocked</h1>
      </div>
     
      {/*// main screen container for Blocked Page */}
      <div className="container">
        {/* rectangle container for Currently Blocked */}
        <div className="CurrentlyBlockedCategoriesContainer">


          <div className="CategoriesRectangleTitle">
            <h2>Categories</h2>
          </div>


          <ul className="category-list">
              <li className="category-item">
                <span>Gaming</span>
                <button className="delete-btn">Delete</button>
              </li>

              <li className="category-item">
                <span>Sports</span>
                <button className="delete-btn">Delete</button>
              </li>

              <li className="category-item">
                <span>Entertainment</span>
                <button className="delete-btn">Delete</button>
              </li>

              <li className="category-item">
                <span>Comedy</span>
                <button className="delete-btn">Delete</button>
              </li>

              <li className="category-item">
                <span>Vlogs</span>
                <button className="delete-btn">Delete</button>
              </li>
            </ul>

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
                style={{ width: "145px" }}
                
              >
                Select Category
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

          <ul className="category-list">
              <li className="category-item">
                <span>Gaming</span>
                <button className="add-btn">Add</button>
              </li>

              <li className="category-item">
                <span>Sports</span>
                <button className="add-btn">Add</button>
              </li>

              <li className="category-item">
                <span>Entertainment</span>
                <button className="add-btn">Add</button>
              </li>

              <li className="category-item">
                <span>Comedy</span>
                <button className="add-btn">Add</button>
              </li>

              <li className="category-item">
                <span>Vlogs</span>
                <button className="add-btn">Add</button>
              </li>
            </ul>
        </div>
      </div>
      {/* // end of main screen container */}
    </div> //end header for currently blocked and category block
  );
};

export default BlockedPages;

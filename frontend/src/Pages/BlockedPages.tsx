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
            <input type="text" name="Categories" placeholder="Search a category" /> 

          </div>
        </div>


      </div>
      {/* // end of main screen container */}


    </div> //end header for currently blocked and category block
  );
};

export default BlockedPages;

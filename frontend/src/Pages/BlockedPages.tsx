import React from 'react'
import "./BlockedPages.css";
 
 const BlockedPages = () => {
   return (
     // main screen container for Blocked Page
     <div className="container">
     <h1 className="CategoryBlockTitle">Category Block</h1>
     <h1 className="CurrentlyBlockedTitle">Currently Blocked</h1>


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
       <h1 >Categories</h1>
       </div>
     </div>
   </div> // end of main screen container
    
  )
};

   

export default BlockedPages;
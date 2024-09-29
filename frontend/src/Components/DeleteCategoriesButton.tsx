import React from "react";
import axios from "axios";

export const DeleteCategoriesButton:React.FC<{ categoryName: string }> = ({ categoryName }) => {

    const user = "thename";
    //handle add button click
    const handleClick = async () => {
      try {
  
          const response = await axios.post(`http://localhost:8080/block-categories/${user}/DeleteCategory`, {
              categoryName: categoryName
          });
         
          console.log("Response from backend:", response.data);
          alert( categoryName + " deleted successfully!");
  
      } catch(error) {
          console.error("Error deleting category", error);
          alert("Failed to delete category!");
      }
    };
  
  return (
    <div>
          <button className="delete-btn"  onClick={handleClick}>Delete</button>
    </div>
  )
}

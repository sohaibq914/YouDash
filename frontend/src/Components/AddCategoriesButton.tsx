import React from "react";
import axios from "axios";

const AddCategoriesButton: React.FC<{ categoryName: string }> = ({ categoryName }) => {

    const user = "thename";
  //handle add button click
  const handleClick = async () => {
    try {

        const response = await axios.post(`http://localhost:8080/block-categories/${user}/addCategory`, {
            categoryName: categoryName
        });
       
        console.log("Response from backend:", response.data);
        alert( categoryName + " added successfully!");

    } catch(error) {
        console.error("Error adding category", error);
        alert("Failed to add category!");
    }
  };

  return (
    <div>
      <button className="add-btn" onClick={handleClick}>Add</button>
    </div>
  );
};

export default AddCategoriesButton;

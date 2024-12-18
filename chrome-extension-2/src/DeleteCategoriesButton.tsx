import React from "react";
import axios from "axios";
import "./DeleteCategoriesButton.css";

interface DeleteCategoriesButtonProps {
  categoryName: string;
  onDeleteCategory: (categoryName: string) => void;
}

export const DeleteCategoriesButton: React.FC<DeleteCategoriesButtonProps> = ({
  categoryName,
  onDeleteCategory,
}) => {
  const user = 12345;
  //handle add button click
  const handleClick = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the category: " + categoryName
    );

    if (confirmDelete) {
      try {
        const response = await axios.post(
          `http://localhost:8080/block-categories/${user}/DeleteCategory`,
          {
            categoryName: categoryName,
          }
        );

        console.log("Response from backend:", response.data);
        alert(categoryName + " deleted successfully!");

        onDeleteCategory(categoryName);
      } catch (error) {
        console.error("Error deleting category", error);
        alert("Failed to delete category!");
      }
    }
  };

  return (
    <div>
      <button className="delete-btn" onClick={handleClick}>
        Delete
      </button>
    </div>
  );
};

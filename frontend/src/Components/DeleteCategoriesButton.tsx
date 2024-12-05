import React, { useState } from "react";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal.tsx"; // Import the modal component
import { toast } from "react-toastify";

export const DeleteCategoriesButton = ({ userId, categoryName, onDeleteCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/block-categories/${userId}/DeleteCategory`,
        { categoryName }
      );
      console.log("Response from backend:", response.data);
      toast.success(`${categoryName} deleted successfully!`);
      onDeleteCategory(categoryName);
    } catch (error) {
      console.error("Error deleting category", error);
      toast.error("Failed to delete category!");
    }
  };

  return (
    <div>
      <button
        className="delete-btn"
        onClick={() => setIsModalOpen(true)} // Open the modal on button click
        id={`delete-btn-${categoryName}`}
      >
        Delete
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        message={`Are you sure you want to delete the category: ${categoryName}?`}
        onConfirm={() => {
          setIsModalOpen(false);
          handleDelete(); // Confirm the delete action
        }}
        onCancel={() => setIsModalOpen(false)} // Close the modal without deleting
      />
    </div>
  );
};

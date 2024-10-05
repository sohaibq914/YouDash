import React, {useState, useEffect} from 'react'
import "./DeleteCategoriesButton.css";
import { DeleteCategoriesButton } from "./DeleteCategoriesButton.tsx";
import "./index.css";
import axios from "axios";


const ChromeExtension = () => {

   // track available categories to block
   const [availableCategories, setAvailableCategories] = useState<string[]>([]);

   // tracks blocked categories
   const [blockedCategories, setBlockedCategories] = useState<string[]>([]);
 
   // gets user input from the input field
   const [inputValue, setInputValue] = useState("");
   // will hold filtered options depending on what user inputs
   const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
 
   // fetch data from backend when the component mounts
   useEffect(() => {
     const userID = 12345;
 
     // Fetch available categories
     const fetchAvailableCategories = async () => {
       try {
         const response = await axios.get(
           `http://localhost:8080/block-categories/${userID}/availableCategories`
         );
         console.log("Available Categories Response:", response.data);
         setAvailableCategories(response.data.availableCategories);
       } catch (error) {
         console.error("Error fetching available categories", error);
       }
     };
 
     // Fetch currently blocked categories
     const fetchBlockedCategories = async () => {
       try {
         const response = await axios.get(
           `http://localhost:8080/block-categories/${userID}/blockedCategories`
         );
         console.log("Blocked Categories Response:", response.data); // Log response
         setBlockedCategories(response.data.blockedCategories);
       } catch (error) {
         console.log("Error fetching blocked categories", error);
       }
     };
 
     fetchAvailableCategories();
     fetchBlockedCategories();
   }, []);
  const handleDeleteCategory = (categoryName: string) => {
    // remove from blocked categories
    const updatedDeletedCategories = blockedCategories.filter(
      (blockedCategory) => blockedCategory != categoryName
    );

    // add deleted category back into the available ones
    setAvailableCategories([...availableCategories, categoryName]);

    // update deleted categories
    setBlockedCategories(updatedDeletedCategories);
  };



  return (
    <div>
        <ul className="category-list">
            {blockedCategories.map((category, index) => (
              <li className="category-item" key={index}>
                <span>{category}</span>
                <DeleteCategoriesButton
                  categoryName={category}
                  onDeleteCategory={handleDeleteCategory}
                />
              </li>
            ))}
          </ul>
    </div>
  )
}

export default ChromeExtension
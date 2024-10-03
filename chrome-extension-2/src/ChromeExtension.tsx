import React, {useState} from 'react'
import "./DeleteCategoriesButton.css";
import { DeleteCategoriesButton } from "./DeleteCategoriesButton.tsx";
import "./index.css";


const ChromeExtension = () => {

  const [availableCategories, setAvailableCategories] = useState([
    "Gaming",
    "Sports",
    "Entertainment",
    "Music",
    "Vlogs",
    "Comedy",
  ]);

  // tracks blocked categories
  const [blockedCategories, setBlockedCategories] = useState<string[]>([]);

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
            {availableCategories.map((category, index) => (
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
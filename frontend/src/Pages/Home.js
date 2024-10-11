import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";


function Home() {
 const navigate = useNavigate();


 const handleLogout = () => {
   // Perform any logout operations here, like clearing tokens or user data
   // Example: localStorage.removeItem("token");


   // Redirect to the login page
   navigate("/login");
 };


 return (
   <div className="Home">
     <h1>Home page: In Progress</h1>
     <button onClick={handleLogout}>Logout</button>
   </div>
 );
}


export default Home;
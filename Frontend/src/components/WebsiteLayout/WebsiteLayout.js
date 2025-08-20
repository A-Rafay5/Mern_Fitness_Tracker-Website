// src/components/WebsiteLayout.js
import { Outlet } from 'react-router-dom';
import Header from './Header'  // Import the Header component
import Footer from './Footer'  

export default function WebsiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />  {/* Include the Header component here */}
      <main><Outlet/></main>
      <Footer/>
    </div>
  )
}

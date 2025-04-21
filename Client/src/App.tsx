import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import { HomePage } from './page/home';
import { SavePage } from './page/save';
import { ArchivePage } from './page/archive';
import NotFoundPage from './page/notFound';
import { Toaster } from 'react-hot-toast';

const App = () =>
{

  return (
    <BrowserRouter>
      <div className="bg-gray-200 flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="ps-1 pe-5 h-screen mt-5 mb-5">
            <Toaster position="top-right" reverseOrder={ false } />
            <Routes>
              <Route path="/" element={ <HomePage /> } />
              <Route path="/save" element={ <SavePage /> } />
              <Route path="/archive" element={ <ArchivePage /> } />
              <Route path="*" element={ <NotFoundPage /> } />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App

import Kanban from "./components/Kanban.js";
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Kanban/>} />
        
      </Routes>
    </BrowserRouter>
  </>
  );
}

export default App;

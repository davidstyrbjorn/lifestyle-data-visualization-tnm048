import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Root: React.FC<{}> = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<div></div>} />
            </Routes>
        </BrowserRouter>
    )   
}

export default Root;
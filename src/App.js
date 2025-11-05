import React from "react";
import Menu from "./components/Menu.jsx";
import "./App.css";

export default function App() {
  return (
    <div>
      {/* Menu Component */}
      <Menu />

      {/* Fixed Branding */}
      <a
  href="https://wa.me/8377861214"
  target="_blank"
  rel="noopener noreferrer"
  className="branding-badge"
>
  Visuplate by G&H
</a>

    </div>
  );
}

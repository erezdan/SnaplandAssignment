import React from "react";
import Layout from "./components/layout/Layout";
import GISMapPage from "./pages/GISMapPage";
import './index.css';

function App() {
  return (
    <Layout currentPageName="GIS Map">
      <GISMapPage />
    </Layout>
  );
}

export default App;

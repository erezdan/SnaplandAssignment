import Layout from "./components/layout/Layout";
import GISMapPage from "./pages/GISMapPage";
import { Toaster } from "./components/ui/toaster";
import './index.css';

function App() {
  return (
    <>
      <Toaster />
      <Layout currentPageName="GIS Map">
        <GISMapPage />
      </Layout>
    </>
  );
}

export default App;

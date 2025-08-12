import Layout from "./components/layout/Layout";
import GISMapPage from "./pages/GISMapPage";
import { Toaster } from "./components/ui/toaster";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import './index.css';

function App() {
  return (
    <>
      <Toaster />
      <WebSocketProvider>
        <Layout currentPageName="GIS Map">
          <GISMapPage />
        </Layout>
      </WebSocketProvider>
    </>
  );
}

export default App;

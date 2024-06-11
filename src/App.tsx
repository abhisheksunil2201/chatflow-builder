import "./App.css";
import Flow from "./components/Flow";
import Header from "./components/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStore, { RFState } from "./store";
import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";

const selector = (state: RFState) => ({
  loadFromLocalStorage: state.loadFromLocalStorage,
});

function App() {
  const { loadFromLocalStorage } = useStore(useShallow(selector));

  useEffect(() => {
    //load from local storage on init
    loadFromLocalStorage();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <Header />
      <Flow />
      <ToastContainer
        limit={1}
        position="bottom-right"
        theme="dark"
        closeButton={false}
        autoClose={4000}
        progressStyle={{ background: "white" }}
      />
    </div>
  );
}

export default App;

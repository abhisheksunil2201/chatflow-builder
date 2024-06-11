import { useShallow } from "zustand/react/shallow";
import useStore, { RFState } from "../../store";
import Button from "../Button/Button";
import styles from "./Header.module.css";
import { toast } from "react-toastify";

const selector = (state: RFState) => ({
  checkEdgeConstraints: state.checkEdgeConstraints,
  saveToLocalStorage: state.saveToLocalStorage,
});

const Header = () => {
  const { checkEdgeConstraints, saveToLocalStorage } = useStore(
    useShallow(selector)
  );
  const handleCheck = () => {
    const checkSatisfies = checkEdgeConstraints();
    if (!checkSatisfies) {
      toast.error("All nodes need to be connected", {
        toastId: "connection-error-toast",
      });
    } else {
      saveToLocalStorage();
      toast.success("Flow saved to localstorage", {
        toastId: "save-toast-success",
      });
    }
  };
  return (
    <div className={styles.header}>
      <p className={styles.logo}>Chatbot Flow Builder</p>
      <Button text="Save Changes" onClick={handleCheck} />
    </div>
  );
};

export default Header;

import { useShallow } from "zustand/react/shallow";
import useStore, { RFState } from "../../store";
import NodesPanel from "../NodesPanel/NodesPanel";
import styles from "./SidePanel.module.css";
import EditNode from "../EditNode/EditNode";

const selector = (state: RFState) => ({
  selectedNode: state.selectedNode,
});

//component t display EditNode panel if a node is seletced else show ALl Nodes panel
const SidePanel = () => {
  const { selectedNode } = useStore(useShallow(selector));
  return (
    <div className={styles.panel}>
      {selectedNode ? <EditNode /> : <NodesPanel />}
    </div>
  );
};

export default SidePanel;

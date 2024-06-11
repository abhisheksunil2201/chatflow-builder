import { useShallow } from "zustand/react/shallow";
import useStore, { RFState } from "../../store";
import styles from "./EditNode.module.css";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { ArrowLeft } from "lucide-react";

const selector = (state: RFState) => ({
  selectedNode: state.selectedNode,
  setSelectedNode: state.setSelectedNode,
  updateNode: state.updateNode,
});
const EditNode = () => {
  const { selectedNode, setSelectedNode, updateNode } = useStore(
    useShallow(selector)
  );
  //set data of the cuurent node to be edited
  const [data, setData] = useState({
    id: selectedNode?.id,
    data: selectedNode?.data,
  });

  useEffect(() => {
    if (!selectedNode) return;
    if (data.id !== selectedNode.id)
      setData({ id: selectedNode.id, data: selectedNode.data });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode]);

  if (!selectedNode) return;

  const handleUpdate = () => {
    //update fn to make changes
    updateNode(selectedNode.id, {
      data: data.data,
    });
    setSelectedNode(null);
  };

  return (
    <div className={styles.editNode}>
      <div className={styles.header}>
        <ArrowLeft
          size={25}
          color="black"
          cursor={"pointer"}
          onClick={() => setSelectedNode(null)}
        />
        <p style={{ textTransform: "capitalize", fontSize: "1.2rem" }}>
          {selectedNode.type}
        </p>
      </div>
      <textarea
        className={styles.data}
        value={data.data}
        onChange={(e) =>
          setData((val) => ({
            ...val,
            data: e.target.value,
          }))
        }
      ></textarea>
      <Button text="Update" onClick={handleUpdate} />
    </div>
  );
};

export default EditNode;

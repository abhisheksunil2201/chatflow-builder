import { Connection, Handle, Node, Position } from "reactflow";
import styles from "./Node.module.css";
import useStore, { RFState } from "../../store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-toastify";

interface MessageNode {
  id: string;
  data: string;
  type: string;
}

const selector = (state: RFState) => ({
  setSelectedNode: state.setSelectedNode,
  getNumberOfConnectedEdges: state.getNumberOfConnectedEdges,
});

export default function MessageNode({ data, id, type }: MessageNode) {
  const { setSelectedNode, getNumberOfConnectedEdges } = useStore(
    useShallow(selector)
  );

  const handleClick = () => {
    setSelectedNode({ id, data, type } as Node);
  };

  const checkConnection = (connection: Connection) => {
    const connections = getNumberOfConnectedEdges(connection.source!);

    if (connections > 0) {
      toast("There can only be 1 edge originating from a source handle", {
        toastId: "error-toast",
      });
      return false;
    }
    return true;
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className={styles.node} onClick={handleClick}>
        <div className={styles.header}>
          <p>Send message</p>
        </div>
        <div className={styles.body}>
          <p>{data}</p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isValidConnection={(connection) => checkConnection(connection)}
      />
    </>
  );
}

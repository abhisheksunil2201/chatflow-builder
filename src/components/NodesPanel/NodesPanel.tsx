import dynamicIconImports from "lucide-react/dynamicIconImports";
import { NodeTypes } from "../../consts";
import Icon from "../Icon";
import styles from "./NodesPanel.module.css";
import { DragEvent, memo, useCallback } from "react";
import useStore, { RFState } from "../../store";
import { useShallow } from "zustand/react/shallow";
import { getNodeId } from "../../utils";

const selector = (state: RFState) => ({
  addNode: state.addNode,
});

type NodeTypesListProps = {
  onNewNode: (type: string) => void;
};

const NodeTypesList = memo(
  ({ onNewNode }: NodeTypesListProps) => {
    const onDragStart = (
      event: DragEvent<HTMLDivElement>,
      nodeType: string
    ) => {
      event.dataTransfer!.setData("application/reactflow", nodeType);
      event.dataTransfer!.effectAllowed = "move";
    };
    return (
      <div className={styles.panel}>
        <p className={styles.heading}>All Nodes</p>
        {NodeTypes.map((type) => (
          <div
            key={type.label}
            className={styles.nodetype}
            onClick={() => onNewNode(type.type)}
            draggable
            onDragStart={(event) => onDragStart(event, type.type)}
          >
            <Icon name={type.icon as keyof typeof dynamicIconImports} />
            {type.label}
          </div>
        ))}
      </div>
    );
  },
  () => true
);
const NodesPanel = memo(() => {
  const { addNode } = useStore(useShallow(selector));

  const handleNewNode = useCallback(
    (type: string) => {
      addNode({
        id: getNodeId(),
        position: { x: Math.random() * 250, y: Math.random() * 250 },
        data: "new node",
        draggable: true,
        deletable: true,
        type,
      });
    },
    [addNode]
  );
  return <NodeTypesList onNewNode={handleNewNode} />;
});

export default NodesPanel;

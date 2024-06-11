import { DragEvent, useCallback, useMemo, useState } from "react";
import ReactFlow, { Background, ReactFlowInstance } from "reactflow";

import "reactflow/dist/style.css";
import MessageNode from "./Node/Node";
import "reactflow/dist/style.css";
import useStore, { RFState } from "../store";
import { useShallow } from "zustand/react/shallow";
import SidePanel from "./SidePanel/SidePanel";
import { getNodeId } from "../utils";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  addNode: state.addNode,
});

export default function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } =
    useStore(useShallow(selector));
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const nodeTypes = useMemo(() => ({ message: MessageNode }), []);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!reactFlowInstance) return;
      const type = event.dataTransfer.getData("application/reactflow");
      console.log(type);

      if (typeof type === "undefined" || !type) {
        return;
      }
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addNode({
        id: getNodeId(),
        position,
        data: "new node",
        draggable: true,
        deletable: true,
        type,
      });
    },
    [reactFlowInstance, addNode]
  );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        height: "700px",
        backgroundColor: "#F5F8FA",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        style={{ flex: "0.8" }}
        onInit={setReactFlowInstance as any}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Background color="black" />
      </ReactFlow>
      <SidePanel />
    </div>
  );
}

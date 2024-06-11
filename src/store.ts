import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  getIncomers,
  getOutgoers,
} from "reactflow";
import { getNodeId } from "./utils";

export const initialNodes = [
  {
    id: getNodeId(),
    position: { x: 0, y: 0 },
    data: "new message node",
    draggable: true,
    deletable: true,
    type: "message",
  },
  {
    id: getNodeId(),
    position: { x: 0, y: 300 },
    data: "new message",
    draggable: true,
    deletable: true,
    type: "message",
  },
];

const initialEdges: Edge[] = [
  // {
  //   id: `e${initialNodes[0].id}-${initialNodes[1].id}`,
  //   source: initialNodes[0].id,
  //   target: initialNodes[1].id,
  // },
];

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  setSelectedNode: (node: Node | null) => void;
  updateNode: (id: string, changes: Partial<Node>) => void;
  getNumberOfConnectedEdges: (id: string) => number;
  checkEdgeConstraints: () => boolean;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  addNode: (node: Node) => {
    set({ nodes: [...get().nodes, node] });
  },
  setSelectedNode: (node: Node | null) => {
    set({ selectedNode: node });
  },
  updateNode: (id: string, changes: Partial<Node>) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, ...changes };
        }
        return node;
      }),
    });
  },
  getNumberOfConnectedEdges: (id: string) => {
    //get the count of incoming edges
    const edges = get().edges;
    const incomingEdges = edges.filter((edge) => edge.source === id);
    return incomingEdges.length;
  },
  checkEdgeConstraints: () => {
    //checking if there are any invalid nodes by the count of incoming and outgoing nodes
    const nodes = get().nodes;
    const edges = get().edges;
    let invalidNodes = 0;

    nodes.forEach((node) => {
      const incomers = getIncomers(node, nodes, edges);
      const outgoers = getOutgoers(node, nodes, edges);
      if (incomers.length === 0 && outgoers.length === 0) invalidNodes += 1;
    });
    return invalidNodes === 0;
  },
  saveToLocalStorage: () => {
    //saving to local storage
    const { nodes, edges } = get();
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
  },
  loadFromLocalStorage: () => {
    //loading from local storage
    const storedNodes = localStorage.getItem("nodes");
    const storedEdges = localStorage.getItem("edges");
    console.log(storedEdges, storedNodes);

    if (storedNodes && storedEdges) {
      set({
        nodes: JSON.parse(storedNodes),
        edges: JSON.parse(storedEdges),
      });
    }
  },
}));

export default useStore;

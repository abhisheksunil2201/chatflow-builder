import { v4 as uuidv4 } from "uuid";

export const getNodeId = () => `randomnode_${uuidv4()}`;

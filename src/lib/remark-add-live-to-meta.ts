import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { Root, Code } from "mdast";

//   return (tree: Root) => {
//     visit(tree, "code", (node) => {
//       // Assert that node is of type Code
//       const codeNode = node as Code;
//       console.log("codeNode", codeNode);
//       if (codeNode.meta && codeNode.meta.includes("live")) {
//         // Ensure proper formatting for MDX by wrapping values in quotes
//         codeNode.meta = codeNode.meta.replace(/live\s*/, "").trim();
//         codeNode.meta = `live="true" ${codeNode.meta}`.trim();
//         console.log("codeNode.meta", codeNode.meta);
//       }
//     });
//   };
const remarkAddLiveToMeta: Plugin<[], Root> = () => {};

export default remarkAddLiveToMeta;

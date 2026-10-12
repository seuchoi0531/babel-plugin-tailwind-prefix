// import { parse } from "@babel/parser";
// import _traverse from "@babel/traverse";
// const traverse = _traverse.default;
// import { generate } from "@babel/generator";
import * as t from "@babel/types";
import fs from "fs";
export default function tailwindPrefixPlugin() {
  return {
    visitor: {
      VariableDeclarator(path, state) {
        const filename = state.file.opts.filename;
        if (!filename.endsWith("InfoCard.tsx")) return;
        const init = path.node.init;
        if (init && init.type === "ObjectExpression") {
          const flag = init.properties.every(e => isValidProperty(e));
          if (!flag) return;
          appendPrefixToValue(path.container[0].init, []);
          // console.log('createdTailwindClasses', createdTailwindClasses);
          fs.writeFileSync('./test.txt', createdTailwindClasses);
        }
      }
    }
  };
}
// export default function tailwindPrefixPlugin() {
//   return {
//     visitor: {
//       VariableDeclarator(path) {
//         console.log(path);
//         if (path.container[0].init.type === "ObjectExpression") {
//           const flag = path.container[0].init.properties.every(e => isValidProperty(e));
//           if (!flag) return;
//           appendPrefixToValue(path.container[0].init, []);
//         }
//       }
//     }
//   };
// }
let createdTailwindClasses = '';
function isValidProperty(propertyNode) {
  let flag = false;
  if (propertyNode.type !== "ObjectProperty") {
    console.log("Node Type is not a <ObjectProperty>.");
    return flag;
  }

  // 프로퍼티의 키의 타입 검사
  const propertyKeyType = propertyNode.key.type
  if (propertyKeyType !== "Identifier" && propertyKeyType !== "StringLiteral") {
    return flag;
  }

  // 프로퍼티의 값의 타입 검사
  const propertyValueType = propertyNode.value.type;
  if (propertyValueType !== "StringLiteral" && propertyValueType !== "ObjectExpression" && propertyValueType !== "ArrayExpression") {
    return flag;
  }
  // 키가 tailwindCSS의 접두사인지 검사
  flag = tailwindPrefixSet.has(propertyNode.key?.name ?? propertyNode.key.value);

  if (flag && propertyValueType === "ObjectExpression")
    flag = propertyNode.value.properties.every(e => isValidProperty(e));
  if (flag && propertyValueType === "ArrayExpression")
    flag = propertyNode.value.elements.every(e => e.type === "StringLiteral");
  return flag;
}

function appendPrefixToValue(node, prefixArray = []) {
  if (node.type === "ObjectExpression") {
    node.properties.forEach(e => appendPrefixToValue(e));
  } else if (node.type === "ObjectProperty") {
    if (node.value.type === "StringLiteral") {
      node.value = t.stringLiteral(appendPrefix([...prefixArray, node.key?.name ?? node.key.value], node.value.value));
    } else if (node.value.type === "ArrayExpression") {
      node.value = t.stringLiteral(appendPrefix([...prefixArray, node.key?.name ?? node.key.value], node.value.elements.map(e => e.value)));
    } else if (node.value.type === "ObjectExpression") {
      node.value.properties.forEach(e => appendPrefixToValue(e, [...prefixArray, node.key?.name ?? node.key.value]));
    }
  }
}

function appendPrefix(pre, value) {
  let prefix = '';
  if (typeof pre === "string") // 접두사가 문자열일 때
    prefix = pre + ":";
  else { // 접두사가 배열일 때
    prefix = pre.join(":") + ":";
  }

  let result = '';
  if (typeof value === "string") { // 값이 문자열일 때
    result = value.trim().split(" ").map(e => prefix + e).join(" ");
  } else { // 값이 배열일 때
    result = value.map(e => prefix + e).join(" ");
  }
  createTailwindClasses(result);
  return result;
}

function createTailwindClasses(str) {
  createdTailwindClasses += " " + str;
}

const tailwindPrefix = [
  "hover",
  "focus",
  "focus-within",
  "focus-visible",
  "active",
  "visited",
  "target",
  "*",
  "**",
  "inert",
  "first",
  "last",
  "only",
  "odd",
  "even",
  "first-of-type",
  "last-of-type",
  "only-of-type",
  "empty",
  "disabled",
  "enabled",
  "checked",
  "indeterminate",
  "default",
  "optional",
  "required",
  "valid",
  "invalid",
  "user-valid",
  "user-invalid",
  "in-range",
  "out-of-range",
  "placeholder-shown",
  "details-content",
  "autofill",
  "read-only",
  "before",
  "after",
  "first-letter",
  "first-line",
  "marker",
  "selection",
  "file",
  "backdrop",
  "placeholder",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "max-sm",
  "max-md",
  "max-lg",
  "max-xl",
  "max-2xl",
  "@3xs",
  "@2xs",
  "@xs",
  "@sm",
  "@md",
  "@lg",
  "@xl",
  "@2xl",
  "@3xl",
  "@4xl",
  "@5xl",
  "@6xl",
  "@7xl",
  "@max-3xs",
  "@max-2xs",
  "@max-xs",
  "@max-sm",
  "@max-md",
  "@max-lg",
  "@max-xl",
  "@max-2xl",
  "@max-3xl",
  "@max-4xl",
  "@max-5xl",
  "@max-6xl",
  "@max-7xl",
  "dark",
  "motion-safe",
  "motion-reduce",
  "contrast-more",
  "contrast-less",
  "forced-colors",
  "inverted-colors",
  "pointer-fine",
  "pointer-coarse",
  "pointer-none",
  "any-pointer-fine",
  "any-pointer-coarse",
  "any-pointer-none",
  "portrait",
  "landscape",
  "noscpae",
  "print",
  "aria-busy",
  "aria-checked",
  "aria-disabled",
  "aria-expanded",
  "aria-hidden",
  "aria-pressed",
  "aria-readonly",
  "aria-required",
  "aria-selected",
  "rtl",
  "ltr",
  "open",
  "starting"
];

const tailwindPrefixSet = new Set(tailwindPrefix);



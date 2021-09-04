export function createElement (tagName, vnode) {
  const elm = document.createElement(tagName)
  if (tagName !== 'select') {
    return elm
  }
  return elm
}

export function createTextNode (text) {
  return document.createTextNode(text)
}

export function tagName (node) {
  return node.tagName
}

export function parentNode (node) {
  return node.parentNode
}

export function nextSibling (node) {
  return node.nextSibling
}

export function appendChild (node, child) {
  node.appendChild(child)
}

export function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode)
}
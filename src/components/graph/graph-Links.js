import uuidv4 from 'uuid/v4'

import { getLinkId } from '@/utils/normalize'

function GraphLinks (links) {
  this.links = links || {}
}

GraphLinks.prototype.getLinks = function getLinks () {
  return this.links
}

GraphLinks.prototype.getLinkList = function getLinkList () {
  return Object.keys(this.links).map(key => this.links[key])
}

GraphLinks.prototype.add = function add (link) {
  const graphLinks = this
  const id = uuidv4()

  if (!graphLinks.isDuplicate(link)) {
    graphLinks.links[id] = {
      id,
      source: link.source,
      target: link.target
    }
  }
}

GraphLinks.prototype.remove = function add (link) {
  delete this.links[getLinkId(link)]
}

GraphLinks.prototype.isDuplicate = function isDuplicate (id) {
  if (this.links[id]) {
    return true
  }

  return false
}

GraphLinks.prototype.findLinks = function findLinks (node) {
  const results = Object.keys(this.links)
    .map(key => this.links[key])
    .filter(link => {
      const { source, target } = link
      return source.sourceId === node.id || target.targetId === node.id
    })
  return results
}

export default GraphLinks

import uuidv4 from 'uuid/v4'

import { getLinkId } from '@/utils/normalize'

function GraphLinks (links) {
  this.links = links || {}
}

GraphLinks.prototype.getLinkList = function getLinkList () {
  return Object.keys(this.links).map(key => this.links[key])
}

GraphLinks.prototype.getLinks = function getLinks () {
  return this.links
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

GraphLinks.prototype.add = function add (link) {
  const thisGraphLinks = this

  const id = uuidv4()

  if (!thisGraphLinks.isDuplicate(link)) {
    thisGraphLinks.links[id] = {
      id,
      source: link.source,
      target: link.target
    }
  }
}

GraphLinks.prototype.remove = function add (link) {
  delete this.links[getLinkId(link)]
}

export default GraphLinks

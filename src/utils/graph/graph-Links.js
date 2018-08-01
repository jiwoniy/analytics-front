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

GraphLinks.prototype.isDuplicate = function isDuplicate (newLink) {
  if (this.links[getLinkId(newLink)]) {
    return true
  }

  return false
}

GraphLinks.prototype.findLinks = function findLinks (node) {
  const results = Object.keys(this.links)
    .map(key => this.links[key])
    .filter(link => {
      return link.sourceId === node.id || link.targetId === node.id
    })
  return results
}

GraphLinks.prototype.add = function add (link) {
  const thisGraphLinks = this

  if (!thisGraphLinks.isDuplicate(link)) {
    thisGraphLinks.links[getLinkId(link)] = {
      ...link,
      sourceId: link.source.id,
      targetId: link.target.id
    }
  }
}

GraphLinks.prototype.remove = function add (link) {
  delete this.links[getLinkId(link)]
}

export default GraphLinks

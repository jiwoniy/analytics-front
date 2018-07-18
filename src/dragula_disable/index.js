import dragula from 'dragula'
import * as d3Selection from 'd3-selection'

function initDragular () {
  const drake = dragula([document.getElementById('leftPanel'), document.getElementById('svg_map')], {
    isContainer: function (el) {
      // only elements in drake.containers will be taken into account
      return el.classList.contains('dragula-container')
    },
    moves: function (el, source, handle, sibling) {
      // elements are always draggable by default
      return el.classList.contains('drag-item')
    },
    accepts: function (el, target, source, sibling) {
      if (target.id === 'svg_map') {
        return true
      }
      return false
    },
    invalid: function (el, handle) {
      // don't prevent any drags from initiating by default
      return false
    },
    copy: true
  })

  drake.on('drag', (el, source) => {
    // el.classList.add('is-moving')
  })

  drake.on('cloned', (el, original, type) => {
    // DOM element original was cloned as clone, of type ('mirror' or 'copy'). Fired for mirror images and when copy: true
    if (type === 'copy') {
      el.classList.add('is-moving')
      original.classList.remove('is-moving')
    }
  })

  drake.on('out', (el, container, source) => {
    // el was dragged out of container or dropped, and originally came from source
  })

  // drake.on('over', (el, original, type) => {
  //   // el is over container, and originally came from source
  // })

  // drake.on('shadow', (el, container, source) => {
  // })

  drake.on('drop', (el, target, source, sibling) => {
    el.classList.contains('is-moving')
    console.log(d3Selection.select(el))
    console.log(d3Selection.select(el).property('title'))
    console.log(d3Selection.select(el).attr('title'))

    // console.log(d3Selection.select(target))
    // this.$emit('update-block', block.dataset.blockId, list.dataset.status, index)
  })

  // drake.on('remove', (el, container, source) => {
  // })

  // drake.on('cancel', (el, container, source) => {
  // })

  drake.on('dragend', (el) => {
    el.classList.remove('is-moving')
  })
}

export default initDragular

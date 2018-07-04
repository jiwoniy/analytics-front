<template>
  <transition name="fade">
    <section class="left-panel__page">
      <button @click="closeLeftPanel"> x</button>

      <ul class="drag-list">
        <li v-for="block in blocks" class="drag-column" :key="block.id">
          <span class="drag-column-header">
            <h2>{{ block.title }}</h2>
          </span>
          <!-- <div class="drag-options"></div> -->
          <ul class="drag-inner-list" :data-status="block">
            <li class="drag-item" v-for="item in block"
              :key="item.id"
              :data-block-id="item.id"
            >
              <!-- <slot :name="item.id"> -->
                <strong> {{ item.status }} </strong>
                <span> {{ item.title }} </span>
                <div> {{ item.id }} </div>
              <!-- </slot> -->
            </li>
          </ul>
        </li>
      </ul>

    </section>
  </transition>
</template>

<script>
import { eventsBus, events } from '@/events'

export default {
  name: 'LEFT-Panel',
  props: {
    blocks: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    closeLeftPanel () {
      eventsBus.$emit(events.LEFT_PANEL, {
        open: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.left-panel__page {
  width: 250px;
  height: 100%;
  display: block;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;

  .drag-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    @media (max-width: 690px) {
        display: block;
    }
  }

  .drag-list .drag-column {
    flex: 1;
    margin: 0 10px;
    position: relative;
    background: rgba(black, 0.2);
    overflow: hidden;

    @media (max-width: 690px) {
        margin-bottom: 30px;
    }

    h2 {
        font-size: 0.8rem;
        margin: 0;
        text-transform: uppercase;
        font-weight: 600;
    }

    .drag-column-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
    }

    // .drag-options {
    //   position: absolute;
    //   top: 44px;
    //   left: 0;
    //   width: 100%;
    //   height: 100%;
    //   padding: 10px;
    //   transform: translateX(100%);
    //   opacity: 0;
    //   // transition: $ease-out;

    //   &.active {
    //       transform: translateX(0);
    //       opacity: 1;
    //   }

      // &-label {
      //     display: block;
      //     margin: 0 0 5px 0;

      //     input {
      //         opacity: 0.6;
      //     }

      //     span {
      //         display: inline-block;
      //         font-size: 0.9rem;
      //         font-weight: 400;
      //         margin-left: 5px;
      //     }
      // }
    // }
  }
}

.drag-item {
  padding: 10px;
  margin: 10px;
  height: 100px;
  background: rgba(black, 0.4);

  &.is-moving {
      transform: scale(1.5);
      background: rgba(black, 0.8);
  }
}

.fade-enter-active {
  animation: fade-in .3s;
}
.fade-leave-active {
  animation: fade-in .3s reverse;
}

@keyframes fade-in {
  0% {
    transform: translateX(-250px);
  }
  100% {
    transform: translateX(0px);
  }
}
</style>

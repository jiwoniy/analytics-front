<template>
  <transition name="modal">
    <section :id="modalId" class="Modal__section" @click="clickModal">

      <div
        class="modal__wrapper"
        :class="{
          'center': position === 'center',
          'top': position === 'top',
          'bottom': position === 'bottom'
        }"
      >
        <div
          class="modal__container"
          :class="{
            'small': size === 'small',
            'medium': size === 'medium',
            'large': size === 'large'
          }"
        >
          <component
            v-if="lazyLoadComponent"
            v-bind:is="lazyLoadComponent"
            :modal-close="(isNeedAccept) => $emit('close', isNeedAccept)"
            :read-only="true">
          </component>
        </div>
      </div>

    </section>
  </transition>
</template>

<script>
export default {
  name: 'Modal-Section',
  props: {
    modalId: {
      require: true,
      type: String,
      default: () => 'modal'
    },
    size: {
      type: String,
      default: () => 'small' // small, medium, large
    },
    position: {
      type: String,
      default: () => 'center' // center, top, bottom
    },
    passParams: {
      type: Object,
      default: () => {}
    },
    isNeedAccept: {
      type: Boolean,
      default: () => false
      // if this value is true, should pass flag to callback
    },
    contentComponent: {
      type: String,
      default: () => ''
    },
    callback: {
      type: Function,
      default: () => null
    }
  },
  i18n: {
    messages: {
      'en': {
        'Ok': 'Ok',
        'No': 'No'
      },
      'ko': {
        'Ok': 'Ok',
        'No': 'No'
      }
    }
  },
  computed: {
    lazyLoadComponent () {
      if (this.contentComponent === 'CreateProject') {
        return () => import('@/components/CreateProject')
      } else if (this.contentComponent === 'CreateWorksheet') {
        return () => import('@/components/CreateWorksheet')
      } else if (this.contentComponent === 'Confirmation') {
        return () => import('@/components/ui/Confirmation')
      } else if (this.contentComponent === 'Palete') {
        return () => import('@/components/panel/ReadOnlyPalete')
      } else if (this.contentComponent === 'CodeEditor') {
        return () => import('@/components/CodeEditor')
      }

      return () => null
    }
  },
  methods: {
    clickModal (event) {
      const id = event.target.className || 'none'
      // when click svg area id will SVGAnimatedString
      if (typeof id === 'string') {
        if (this.isNeedAccept) {
          if (id.indexOf('modal-close-with-accept') > -1) {
            this.$emit('close', true)
          } else if (id.indexOf('modal-close-with-decline') > -1) {
            this.$emit('close', false)
          }
        } else {
          if (id.indexOf('modal__wrapper') > -1 ||
            id.indexOf('modal-close-with-accept') > -1 ||
            id === 'modal-close-with-decline') {
            this.$emit('close')
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.Modal__section {
  --app-modal-margin: 2rem;
  --app-modal-margin-double: 4rem;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.Modal__section .modal__wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: var(--app-modal-margin) auto;
  height: calc(100% - var(--app-modal-margin-double));

  .modal__container {
    position: relative;
    margin: 0px auto;
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal__container.small {
    width: 40%;
    min-width: 300px;
    height: calc(40% - var(--app-modal-margin-double));
  }
  .modal__container.medium {
    width: 60%;
    height: calc(60% - var(--app-modal-margin-double));
  }
  .modal__container.large {
    width: 90%;
    height: calc(90% - var(--app-modal-margin-double));
  }
}

.Modal__section .modal__wrapper.top {
  align-items: flex-start;
}
.Modal__section .modal__wrapper.bottom {
  align-items: flex-end;
}

/* transition modal */
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal__container,
.modal-leave-active .modal__container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

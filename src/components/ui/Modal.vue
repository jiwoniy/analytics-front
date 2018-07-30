<template>
  <transition name="modal">
    <div class="modal-page" @click="clickModal">

      <div class="modal-wrapper"
        :class="{
          'center': position === 'center',
          'top': position === 'top',
          'bottom': position === 'bottom'
        }"
      >

        <div class="modal-container"
          :class="{
            'small': size === 'small',
            'medium': size === 'medium',
            'large': size === 'large'
          }"
        >
          <div class="header">
            <slot name="header">
            </slot>
          </div>

          <div class="body">
            <slot name="body">
            </slot>
          </div>

          <div class="footer">
            <slot name="footer">
              <wrapper-button
                class="modal-close-with-accept"
                :button-text="$t('Ok')"
              >
              </wrapper-button>
              <wrapper-button
                class="modal-close-with-decline"
                :button-text="$t('No')"
              >
              </wrapper-button>
            </slot>
          </div>

        </div>
      </div>

    </div>
  </transition>
</template>

<script>
import WrapperButton from '@/components/ui/Wrapper/Button'

export default {
  name: 'Modal',
  components: {
    WrapperButton
  },
  props: {
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
  data () {
    return {
      showModal: false
    }
  },
  methods: {
    clickModal (event) {
      const id = event.target.className || ''
      if (this.isNeedAccept) {
        if (id.indexOf('modal-close-with-accept') > -1) {
          this.$emit('close', true)
        } else if (id.indexOf('modal-close-with-decline') > -1) {
          this.$emit('close', false)
        }
      } else {
        if (id.indexOf('modal-wrapper') > -1 || id.indexOf('modal-close-with-accept') > -1 || id === 'modal-close-with-decline') {
          this.$emit('close')
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.modal-page {
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

.modal-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: var(--app-modal-margin) auto;
  height: calc(100% - var(--app-modal-margin-double));
}

.modal-wrapper.top {
  align-items: flex-start;
}
.modal-wrapper.bottom {
  align-items: flex-end;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;

  .header h3 {
    margin-top: 0;
    color: #42b983;
  }
  .body {
    margin: 20px 0;
  }
  .footer {
    .modal-close-button {
      float: right;
    }
  }
}

.modal-container.small {
  width: 40%;
  min-width: 300px;
  height: calc(40% - var(--app-modal-margin-double));
}
.modal-container.medium {
  width: 60%;
  height: calc(60% - var(--app-modal-margin-double));
}
.modal-container.large {
  width: 90%;
  height: calc(90% - var(--app-modal-margin-double));
}

/* transition modal */
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

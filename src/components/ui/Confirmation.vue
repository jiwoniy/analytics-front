<template>
  <section class="Confirmation__section">

    <div class="contents">
      <h1> {{ $t('Are you sure you want to delete') }} </h1>
    </div>

    <div class="contents" >
      <wrapper-button
        :click-event="clickYes"
        :button-text="$t('Yes')">
      </wrapper-button>
      <wrapper-button
        :click-event="clickCancel"
        :button-text="$t('Cancel')">
      </wrapper-button>
    </div>
  </section>
</template>

<script>
import WrapperButton from '@/components/ui/Wrapper/Button'

export default {
  name: 'Confirmation-Comp',
  components: {
    WrapperButton
  },
  i18n: {
    messages: {
      'en': {
        'Yes': 'Yes',
        'Cancel': 'Cancel',
        'Are you sure you want to delete': 'Are you sure you want to delete'
      },
      'ko': {
        'Yes': '예',
        'Cancel': '취소',
        'Are you sure you want to delete': 'Are you sure you want to delete'
      }
    }
  },
  props: {
    modalClose: {
      type: Function,
      default: () => null
    }
  },
  methods: {
    clickYes () {
      if (this.modalClose) {
        this.modalClose(true)
      }
    },
    clickCancel () {
      if (this.modalClose) {
        this.modalClose()
      }
    }
  }
}
</script>

<style lang="scss" scroped>
.Confirmation__section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 400px;
  height: 300px;
  background-color: #eee;

  .contents {
    margin: 1rem;
    width: calc(100% - 2rem);
  }
}
</style>

<template>
  <section class="Create-project__section">

    <div class="contents__container">
      <div class="modal-header__container">
        <h1> {{ $t('Create Project') }} </h1>
      </div>

      <div class="modal-body__container">
        <label>
          {{ $t('Project name') }}
        </label>
        <wrapper-input
          :is-un-lock="true"
          v-model="projectName"
          @wrapperEvent="(value) => wrapperEvent('projectName', value)">
        </wrapper-input>

        <label>
          {{ $t('Description') }}
        </label>
        <wrapper-textarea
          :is-un-lock="true"
          v-model="projectDesc"
          @wrapperEvent="(value) => wrapperEvent('projectDesc', value)">
        </wrapper-textarea>
      </div>

      <div class="modal-bottom__container" >
        <wrapper-button
          :click-event="clickCreateProject"
          :button-text="$t('Create')">
        </wrapper-button>
        <wrapper-button
          :click-event="clickCancel"
          :button-text="$t('Cancel')">
        </wrapper-button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

import WrapperButton from '@/components/ui/Wrapper/Button'
import WrapperInput from '@/components/ui/Wrapper/Input'
import WrapperTextarea from '@/components/ui/Wrapper/Textarea'

export default {
  name: 'Create-Project-Section',
  components: {
    WrapperButton,
    WrapperInput,
    WrapperTextarea
  },
  i18n: {
    messages: {
      'en': {
        'Create': 'Create',
        'Cancel': 'Cancel',
        'Create Project': 'Create Project',
        'Project name': 'Project name',
        'Description': 'Description'
      },
      'ko': {
        'Create': '생성',
        'Cancel': 'Cancel',
        'Create Project': '프로젝트 생성',
        'Project name': '프로젝트명',
        'Description': '설명'
      }
    }
  },
  data () {
    return {
      projectName: '',
      projectDesc: ''
    }
  },
  props: {
    // get from modal comp
    modalClose: {
      type: Function,
      default: () => null
    }
  },
  methods: {
    ...mapActions({
      createProject: 'myProject/createProject'
    }),
    wrapperEvent (key, value) {
      this[key] = value
    },
    clickCreateProject () {
      if (this.projectName && this.projectName.length) {
        this.createProject({
          projectName: this.projectName,
          projectDesc: this.projectDesc
        })
        if (this.modalClose) {
          this.modalClose()
        }
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
.Create-project__section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 400px;
  height: 300px;
  background-color: #eee;

  padding: 0.2rem;
}

.Create-project__section .contents__container {
  height: 100%;
  width: 100%;
}
</style>

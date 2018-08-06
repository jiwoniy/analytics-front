<template>
  <transition>
    <section class="create-project">

      <div class="contents header">
        <h1> {{ $t('Create Project') }} </h1>
      </div>

      <div class="contents body">
        <label>
          {{ $t('Project name') }}
        </label>
        <wrapper-input
          :is-editable="true"
          v-model="projectName"
          @wrapperEvent="(value) => wrapperEvent('projectName', value)">
        </wrapper-input>

        <label>
          {{ $t('Description') }}
        </label>
        <wrapper-textarea
          :is-editable="true"
          v-model="projectDesc"
          @wrapperEvent="(value) => wrapperEvent('projectDesc', value)">
        </wrapper-textarea>
      </div>

      <div class="contents bottom" >
        <wrapper-button
          :click-event="clickCreateProject"
          :button-text="$t('Create')">
        </wrapper-button>
      </div>
    </section>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

import WrapperButton from '@/components/ui/Wrapper/Button'
import WrapperInput from '@/components/ui/Wrapper/Input'
import WrapperTextarea from '@/components/ui/Wrapper/Textarea'

export default {
  name: 'Create-Project',
  components: {
    WrapperButton,
    WrapperInput,
    WrapperTextarea
  },
  i18n: {
    messages: {
      'en': {
        'Create': 'Create',
        'Create Project': 'Create Project',
        'Project name': 'Project name',
        'Description': 'Description'
      },
      'ko': {
        'Create': '생성',
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
    callback: {
      type: Function,
      default: () => []
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
        if (this.callback) {
          this.callback()
        }
      }
    }
  }
}
</script>

<style lang="scss" scroped>
.create-project {
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

<template>
  <transition>
    <section class="create-project">
      <div class="contents">
        <h1> {{ $t('Create Project') }} </h1>

        <label>
          {{ $t('Project name') }}
        </label>
        <wrapper-input
          :is-editable="true"
          v-model="name"
          @wrapperEvent="(value) => wrapperEvent('name', value)">
        </wrapper-input>

        <label>
          {{ $t('Description') }}
        </label>
        <wrapper-textarea
          :is-editable="true"
          v-model="description"
          @wrapperEvent="(value) => wrapperEvent('description', value)">
        </wrapper-textarea>

      </div>
    </section>
  </transition>
</template>

<script>
import WrapperInput from '@/components/ui/Wrapper/Input'
import WrapperTextarea from '@/components/ui/Wrapper/Textarea'

export default {
  name: 'Create-Project',
  components: {
    WrapperInput,
    WrapperTextarea
  },
  i18n: {
    messages: {
      'en': {
        'Create Project': 'Create Project',
        'Project name': 'Project name',
        'Description': 'Description'
      },
      'ko': {
        'Create Project': '프로젝트 생성',
        'Project name': '프로젝트명',
        'Description': '설명'
      }
    }
  },
  data () {
    return {
      name: '',
      description: ''
    }
  },
  methods: {
    wrapperEvent (key, value) {
      this[key] = value
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
  }
}
</style>

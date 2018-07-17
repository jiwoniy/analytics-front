<template>
  <div class="div--Accordion">
    <ul>
      <li>
        <input id="rad1" type="radio" name="rad" checked="checked"/>
        <label for="rad1">
          <div> {{ $t('Project List') }} </div>
        </label>
        <div class="accslide">
          <div class="content">
            <h1> {{ $t('Project List') }} </h1>
            <list-view
              :items="projectList"
              :selected-item-id="selectedProject.id"
              :item-click="projectClick"
            ></list-view>
          </div>
        </div>
      </li>

      <li>
        <input id="rad2" type="radio" name="rad"/>
        <label for="rad2">
          <div> {{ $t('Worksheet List') }} </div>
        </label>
        <div class="accslide">
          <div class="content">
            <h1> {{ $t('Worksheet List') }} </h1>
            <list-view
              :items="worksheetList"
              :selected-item-id="selectedWorksheet.id"
              :item-click="worksheetClick"
            ></list-view>
          </div>
        </div>
      </li>

      <li>
        <input id="rad3" type="radio" name="rad"/>
        <label for="rad3">
          <div> {{ $t('Pipeline Design Tool') }} </div>
        </label>
        <div class="accslide">
          <div class="content">
            <h1> {{ $t('Pipeline Design Tool') }} </h1>
            <p>Lorem ipsum...</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import ListView from '@/components/ui/ListView'

export default {
  name: 'Vertical-Accordion',
  components: {
    ListView
  },
  i18n: {
    messages: {
      'en': {
        'Project List': 'Project List',
        'Worksheet List': 'Worksheet List',
        'Pipeline Design Tool': 'Pipeline Design Tool'
      },
      'ko': {
        'Project List': '프로젝트',
        'Worksheet List': '워크시트',
        'Pipeline Design Tool': '파이프라인 설계'
      }
    }
  },
  props: {
    projectList: {
      type: Array,
      default: () => []
    },
    selectedProject: {
      type: Object,
      default: () => {}
    },
    worksheetList: {
      type: Array,
      default: () => []
    },
    selectedWorksheet: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    ...mapActions({
      setSelectedProject: 'myProject/setSelectedProject',
      setSelectedWorksheet: 'myProject/setSelectedWorksheet'
    }),
    projectClick (event) {
      if (event.target) {
        const projectId = event.target.id || event.target.parentElement.id
        this.setSelectedProject(projectId)
      }
    },
    worksheetClick (event) {
      if (event.target) {
        const worksheetId = event.target.id || event.target.parentElement.id
        this.setSelectedWorksheet(worksheetId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.div--Accordion {
  $max-tabs: 3;
  $label-tab-width: 40px;
  $clr-bg: #1C1F2B;
  $clr-white: #ffffff;
  $clr-blue: blue;
  $clr-bg-light: lighten($clr-bg, 10%);
  $clr-bg-lighter: lighten($clr-bg, 15%);
  $clr-bg-dark: darken($clr-bg, 2.5%);
  $clr-bg-darker: darken($clr-bg, 5%);
  $clr-text: $clr-white;
  $clr-text-hint: rgba($clr-text, .6);
  $clr-primary: $clr-blue;

  width: 100%;

  ul {
    list-style: none;
  }

  // Hide the input
  input {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  label {
    display: block;
    float: left;
    height: 100vh;
    width: $label-tab-width;
    overflow: hidden;

    background: $clr-bg-light;
    text-align: center;
    font-size: 14px;
    line-height: $label-tab-width + 10;
    transition: background 300ms ease;
  }

  li:nth-child(even) > input + label {
    background: $clr-bg-lighter;
  }

  label:hover,
  li:nth-child(even) > input + label:hover {
    background: $clr-primary;
    color: #fff;
    cursor: pointer;
  }

  .accslide {
    display: block;
    height: 100%;
    width: 0px;
    padding: 10px 0;
    float: left;
    overflow-x: hidden;
    // font-sizes: 12px;
    line-height: 1.5;
    transition: all 700ms ease;
  }

  input[type="radio"]:checked ~ label {
    background: $clr-primary;
    color: #fff;
    cursor: default !important;
  }

  input[type="radio"]:not(:checked) ~ label > * {
    padding-left: 7px;
    // font-size: 1.2em;
    white-space: nowrap;
    transform: rotate(90deg);
  }

  input[type="radio"]:checked ~ label > * {
    display: none;
  }

  @for $i from 2 through $max-tabs {
    @for $j from 1 through $i {
      li:nth-child(#{$j}):nth-last-child(#{$i - $j + 1}) input[type="radio"]:checked ~ .accslide {
        width: calc(100% - #{$i * $label-tab-width});
      }
    }
  }
}
</style>

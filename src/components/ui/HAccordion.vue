<template>
  <div class="div--Accordion">
    <ul>

      <li>
        <input id="worksheet" type="radio" name="rad" checked="checked"  value="worksheet" v-model="selectMenu"/>
        <label for="worksheet">
          <div v-if="activateWorksheet && activateWorksheet.name"> {{ activateWorksheet.name }} </div>
          <div v-if="!(activateWorksheet && activateWorksheet.name)"> {{ $t('Add worksheet') }} </div>
        </label>
        <div class="accslide">
          <div class="content">
            <!-- <h1> {{ $t('Worksheet List') }} </h1> -->
            <list-view
              :items="worksheetList"
              :item-class="'text-ellipsis__default'"
              :item-style="{
                'font-size': '1.4rem',
                'margin': '0.5rem'
              }"
              :selected-item-id="activateWorksheet.id"
              :item-click="worksheetClick">
            </list-view>
          </div>

          <div class="add-worksheet">
            <img class="close" src="/static/img/plus-circle-solid.svg" />
            <span> {{ $t('Add worksheet') }} </span>
          </div>
        </div>
      </li>

      <li>
        <input id="tools" type="radio" name="rad" value="tools" v-model="selectMenu"/>
        <label for="tools">
          <div> {{ $t('Pipeline Design Tool') }} </div>
        </label>
        <div class="accslide">
          <div class="content">
            <!-- <h1> {{ $t('Pipeline Design Tool') }} </h1> -->
            <slot name="pipeline-item"></slot>
          </div>
        </div>
      </li>

    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ListView from '@/components/ui/ListView'

export default {
  name: 'Horizontal-Accordion',
  components: {
    ListView
  },
  i18n: {
    messages: {
      'en': {
        'Worksheet List': 'Worksheet List',
        'Pipeline Design Tool': 'Pipeline Design Tool',
        'Add worksheet': 'Add worksheet'
      },
      'ko': {
        'Worksheet List': '워크시트',
        'Pipeline Design Tool': '파이프라인 설계',
        'Add worksheet': '워크시트 추가'
      }
    }
  },
  data () {
    return {
      selectMenu: 'worksheet'
    }
  },
  props: {
    worksheetList: {
      type: Array,
      default: () => []
    },
    activateWorksheet: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      activateProject: 'myProject/getActivateProject'
    })
  },
  methods: {
    ...mapActions({
      setActivateWorksheetId: 'myProject/setActivateWorksheetId'
    }),
    worksheetClick (event) {
      if (event.target) {
        const worksheetId = event.target.id || event.target.parentElement.id
        this.setActivateWorksheetId(worksheetId)
        this.selectMenu = 'tools'
      }
    }
  },
  watch: {
    activateProject (newVal) {
      this.selectMenu = 'worksheet'
    }
  }
}
</script>

<style lang="scss" scoped>
.div--Accordion {
  display: inline-block;
  width: 100%;
  // height: calc(100vh - var(--app-top-panel-height));
  $max-tabs: 2;
  $label-tab-width: 40px;

  $clr-bg: #1C1F2B;
  $clr-white: #ffffff;
  $clr-blue: var(--app-left-panel-color);
  $clr-bg-light: lighten($clr-bg, 10%);
  $clr-bg-lighter: lighten($clr-bg, 15%);
  $clr-bg-dark: darken($clr-bg, 2.5%);
  $clr-bg-darker: darken($clr-bg, 5%);
  $clr-text: $clr-white;
  $clr-text-hint: rgba($clr-text, .6);
  $clr-primary: $clr-blue;

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
    width: $label-tab-width;
    height: calc(100vh - var(--app-top-panel-height));
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
    // display: block;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 0px;
    height: calc(100vh - var(--app-top-panel-height) - var(--app-foot-panel-height));
    float: left;
    overflow-x: hidden;
    line-height: 1.5;
    transition: all 700ms ease;
  }

  input[type="radio"]:checked ~ label {
    background: $clr-primary;
    color: #fff;
    width: 0px;
    cursor: default !important;
  }

  input[type="radio"]:not(:checked) ~ label > * {
    padding-left: 7px;
    width: $label-tab-width;
    white-space: nowrap;
    transform: rotate(90deg);
  }

  input[type="radio"]:checked ~ label > * {
    display: none;
  }

  @for $i from 1 through $max-tabs {
    li:nth-child(#{$i}) input[type="radio"]:checked ~ .accslide {
      width: calc(100% - #{$label-tab-width});
    }
  }
}

.add-worksheet {
  cursor: pointer;
  width: calc(100% - 0.8rem);
  vertical-align: bottom;
  display: flex;
  float: bottom;
  flex-direction: row;
  align-items: center;
  font-size: 1.4rem;
  padding: 0.5rem 0.4rem;
  img {
    padding-right: 0.2rem;
    width: 25px;
    height: 25px;
  }
}

// @for $i from 1 through $max-tabs {
// @for $j from 1 through $i {
  // li:nth-child(#{$j}):nth-last-child(#{$i - $j + 1}) input[type="radio"]:checked ~ .accslide {
      // width: calc(100% - #{$i * $label-tab-width});
//     }
//   }
// }
</style>

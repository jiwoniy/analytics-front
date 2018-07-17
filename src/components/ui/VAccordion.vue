<template>
  <div class="div--Accordion">
    <ul>
      <li>
        <input id="rad1" type="radio" name="rad" checked="checked"/>
        <label for="rad1">
          <div> Project List </div>
        </label>
        <div class="accslide">
          <div class="content">
            <h1>Just keep going with longer text</h1>
            <p>Lorem ipsum...</p>
          </div>
        </div>
      </li>

      <li>
        <input id="rad2" type="radio" name="rad"/>
        <label for="rad2">
          <div> Worksheet List </div>
        </label>
        <div class="accslide">
          <div class="content">
            <h1>Second panel</h1>
            <p>Lorem ipsum...</p>
          </div>
        </div>
      </li>

      <li>
        <input id="rad3" type="radio" name="rad"/>
        <label for="rad3">
          <div> Pipeline Design Tool </div>
        </label>
        <div class="accslide">
          <div class="content">
            <h1>Third panel</h1>
            <p>Lorem ipsum...</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Vertical-Accordion'
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

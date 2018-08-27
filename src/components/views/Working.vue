<template>
  <section class="Working__section">
    <drop-comp>
      <svg-palete
        slot="svg-container">
      </svg-palete>
    </drop-comp>
  </section>
</template>

<script>
import DropComp from '@/components/common/Drop'
import SvgPalete from '@/components/common/Palete'

export default {
  name: 'Working-Section',
  components: {
    DropComp,
    SvgPalete
  }
}
</script>

<style lang="scss" scoped>
.Working__section {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div>
    <Card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
import Sale from './Sale'
import Observe from './Observe'
import Card from '@/views/dashboard/Card'
export default {
  components: {
    Card,
    Sale,
    Observe
  },
  mounted() {
    // this.$store.dispatch('getData')
  }
}
</script>

<style>

</style>

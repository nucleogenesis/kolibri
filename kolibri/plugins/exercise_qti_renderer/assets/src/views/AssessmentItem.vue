<template>

  <div>
    <ItemBody
      v-for="child in children"
      v-if="child.tagName=='itemBody'"
      :key="child.id"
      :dom="child"
      @submit="$emit('submit', $event)"
    />
  </div>

</template>


<script>

  import domMixin from '../mixins/domMixin';
  import ItemBody from './ItemBody';

  export default {
    components: {
      ItemBody,
    },
    mixins: [domMixin],
  };

</script>


<style lang="scss" scoped></style>

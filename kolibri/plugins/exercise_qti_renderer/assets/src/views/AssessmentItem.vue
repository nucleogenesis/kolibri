<template>

  <div>
    <ItemBody
      v-if="itemBody"
      :key="currentAssessmentItem.identifier"
      :dom="itemBody"
      @submit="$emit('submit', $event)"
    />
  </div>

</template>


<script>

  import { mapGetters } from 'vuex';
  import ItemBody from './ItemBody';

  export default {
    components: {
      ItemBody,
    },
    computed: {
      ...mapGetters('qti_exercise', ['currentAssessmentItem']),
      itemBody() {
        return this.currentAssessmentItem.itemBody;
      },
    },
  };

</script>


<style lang="scss" scoped></style>

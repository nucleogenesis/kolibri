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
  import domMixin from '../mixins/domMixin';
  import ItemBody from './ItemBody';

  export default {
    components: {
      ItemBody,
    },
    mixins: [domMixin],
    computed: {
      ...mapGetters('qti_exercise', ['currentAssessmentItem']),
      itemBody() {
        return this.currentAssessmentItem.itemBody;
      },
    },
  };

</script>


<style lang="scss" scoped></style>

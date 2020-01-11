<template>

  <div>
    <AssessmentTest />
  </div>

</template>

<script>

  import client from 'kolibri.client';
  import { mapGetters } from 'vuex';
  import AssessmentItem from './AssessmentItem';
  import AssessmentSection from './AssessmentSection';
  import AssessmentTest from './AssessmentTest';

  export default {
    name: 'QtiExerciseRenderer',
    components: {
      AssessmentItem,
      AssessmentSection,
      AssessmentTest,
    },
    data: () => ({
      children: [],
    }),
    mounted() {
      const parser = new DOMParser();
      const method = 'GET';
      const path = this.defaultFile.storage_url;
      client({ path, method }).then(({ entity }) => {
        const DOM = parser.parseFromString(entity, 'text/xml');
        this.$store.commit('qti_exercise/INITIALIZE', DOM.children);
      });
    },
  };

</script>

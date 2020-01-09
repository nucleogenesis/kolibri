<template>

  <div>
    <h1>Hello Component World</h1>
    <component :is="child.tagName" v-for="child in children" :key="child.id" :dom="child" />
  </div>

</template>

<script>

  import client from 'kolibri.client';
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
        this.children = DOM.children;
      });
    },
  };

</script>

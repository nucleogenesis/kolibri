<!-- NOTE!! IMPORTANT
should not be developed independently of the other ResourceSelection component associated with quiz
-->
<template>

  <div>
    <h1>LessonResourceSelection</h1>
    <ResourceSelection />
  </div>

</template>


<script>
  import ResourceSelection from '../CreateExamPage/ResourceSelection';

  export default {
    name: 'LessonResourceSelection',
    components: { ResourceSelection },
  };

</script>

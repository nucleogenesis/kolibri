<template>

  <p> {{ prompt }} </p>

</template>


<script>

  export default {
    name: 'Prompt',
    props: {
      dom: {
        type: Element,
      },
    },
    computed: {
      prompt() {
        return this.dom.textContent;
      },
    },
  };

</script>


<style></style>

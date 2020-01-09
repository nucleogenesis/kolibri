<template>

  <form @submit.prevent="$emit('submit', $event)">
    <Prompt v-for="prompt in prompts" :key="prompt.id" :dom="prompt" />

    <k-radio-button
      v-for="(choice, index) in choices"
      :key="index"
      v-model="response"
      :label="choice.textContent"
      :radiovalue="choice.attributes.identifier.value"
      @change="$emit('submit', response)"
    />

  </form>

</template>


<script>

  // prompt component?
  import domMixin from '../../mixins/domMixin';
  import Prompt from './Prompt';

  export default {
    name: 'ChoiceInteraction',
    components: {
      Prompt,
    },
    mixins: [domMixin],
    props: {
      dom: Element,
    },
    data() {
      return {
        response: '',
      };
    },
    computed: {
      prompts() {
        // Not sure there could ever be more than one.
        return this.children.filter(element => element.tagName === 'prompt');
      },
      choices() {
        return this.children.filter(element => element.tagName === 'simpleChoice');
      },
    },
  };

</script>


<style></style>

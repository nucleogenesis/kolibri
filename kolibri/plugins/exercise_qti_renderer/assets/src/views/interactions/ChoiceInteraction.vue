<template>

  <form @submit.prevent="$emit('submit', $event)">
    <Prompt v-for="prompt in prompts" :key="prompt.id" :dom="prompt" />

    {{ currentAssessmentItem.title }}

    <KRadioButton
      v-for="(choice) in choices"
      :key="choice.attributes.identifier.value"
      :label="choice.textContent"
      :value="choice.attributes.identifier.value"
      :currentValue="response"
      @change="response = choice.attributes.identifier.value"
    />

  </form>

</template>


<script>

  // prompt component?
  import { mapGetters } from 'vuex';
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
    mounted() {
      console.log('mounting')
      this.response = this.responseForCurrentItem || '';
    },
    beforeDestroy(){
      console.log('destroying')
    },
    computed: {
      ...mapGetters('qti_exercise', ['currentAssessmentItem', 'responseForCurrentItem']),
      prompts() {
        // Not sure there could ever be more than one.
        return this.children.filter(element => element.tagName === 'prompt');
      },
      choices() {
        return this.children.filter(element => element.tagName === 'simpleChoice');
      },
    },
    watch: {
      response() {
        this.saveResponse();
      },
    },
    methods: {
      saveResponse() {
        if (this.response !== this.responseForCurrentItem) {
          this.$store.commit('qti_exercise/UPDATE_RESPONSE', {
            itemIdentifier: this.currentAssessmentItem.identifier,
            value: this.response,
          });
        }
      },
    },
  };

</script>


<style></style>

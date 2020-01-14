<template>

  <div>
    <em>Max choices: {{ maxChoices }} </em>
    <KCheckbox
      v-for="(choice) in choices"
      :key="choice.attributes.identifier.value"
      :label="choice.textContent"
      :value="choice.attributes.identifier.value"
      :checked="responses.includes(choice.attributes.identifier.value)"
      :disabled="responses.length === maxChoices && !responses.includes(choice.attributes.identifier.value)"
      @change="toggleResponseSelection(choice.attributes.identifier.value)"
    />
  </div>

</template>


<script>

  import { mapGetters } from 'vuex';

  export default {
    name: 'ChoiceMultiple',
    props: {
      choices: {
        type: Array,
      },
    },
    data() {
      return {
        responses: [],
      };
    },
    computed: {
      ...mapGetters('qti_exercise', ['currentAssessmentItem', 'responseForCurrentItem']),
      maxChoices() {
        return parseInt(this.currentAssessmentItem.itemBody.maxChoices);
      },
    },
    watch: {
      responses() {
        this.saveResponse();
      },
    },
    mounted() {
      this.responses = this.responseForCurrentItem || [];
    },
    methods: {
      toggleResponseSelection(response) {
        const responseIndex = this.responses.indexOf(response);
        if (responseIndex === -1) {
          if (this.responses.length === this.maxChoices) {
            return;
          }
          this.responses = [...this.responses, response];
        } else {
          const responses = Array.from(this.responses);
          responses.splice(responseIndex, 1);
          this.responses = responses;
        }
      },
      saveResponse() {
        if (!this.isEqual(this.responses, this.responseForCurrentItem)) {
          this.$store.commit('qti_exercise/UPDATE_RESPONSE', {
            itemIdentifier: this.currentAssessmentItem.identifier,
            value: this.responses,
          });
        }
      },
      isEqual(arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;

        const included = arr1.map(e1 => arr2.includes(e1));
        return included.includes(false) || arr1.length != arr2.length ? false : true;
      },
    },
  };

</script>

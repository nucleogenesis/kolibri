<template>

  <div>
    <AssessmentItem />
    <KButton @click="$store.dispatch('qti_exercise/previousAssessmentItem')">
      Back
    </KButton>
    <KButton @click="$store.dispatch('qti_exercise/nextAssessmentItem')">
      Continue
    </KButton>

    </button>
  </div>

</template>

<script>

  import domMixin from '../mixins/domMixin';
  import AssessmentSection from './AssessmentSection';
  import AssessmentItem from './AssessmentItem';

  export default {
    name: 'AssessmentTest',
    components: {
      AssessmentSection,
      AssessmentItem,
    },
    mixins: [domMixin],
    data() {
      return {
        bgColor: '',
        textColor: '',
        rotationDegree: '',
        answered: false,
      };
    },
    computed: {},
    methods: {
      checkAnswer(answer) {
        const correctAnswer = this.dom.querySelector('correctResponse').textContent.trim();
        this.bgColor = answer === correctAnswer ? 'green' : 'red';
        this.textColor = answer === correctAnswer ? 'white' : 'black';
        this.answered = true;
      },
      transform() {
        const colorArray = [
          'grey',
          'red',
          'blue',
          'orange',
          'green',
          'black',
          'pink',
          'maroon',
          'lightblue',
          'salmon',
          'wheat',
          'violet',
          'lawngreen',
        ];
        function getRandomInt() {
          return Math.floor(Math.random() * Math.floor(colorArray.length - 1));
        }
        this.bgColor = colorArray[getRandomInt()];
        this.textColor = colorArray[getRandomInt()];
        this.rotationDegree = getRandomInt();
      },
    },
  };

</script>

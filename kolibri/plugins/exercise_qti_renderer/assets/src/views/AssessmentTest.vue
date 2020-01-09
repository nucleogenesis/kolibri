<template>

  <div :style="{ 'background-color': bgColor, color: textColor, transform: transformDef}">
    <component
      :is="child.tagName"
      v-for="child in children"
      :key="child.id"
      :dom="child"
      @submit="checkAnswer($event)"
    />
    <button v-if="answered" class="transform-button" @click="transform">
      TRANSFORM!
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
    computed: {
      transformDef() {
        return `rotate(0.${this.rotationDegree}turn)`;
      },
    },
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

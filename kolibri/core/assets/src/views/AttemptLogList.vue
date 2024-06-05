<template>

  <div :style="{ backgroundColor: $themeTokens.surface }">
    <h3
      id="answer-history-label"
      class="header"
    >
      {{ $tr('answerHistoryLabel') }}
    </h3>

    <KSelect
      v-if="isMobile"
      class="history-select"
      :value="selected"
      aria-labelledby="answer-history-label"
      :options="options"
      :disabled="$attrs.disabled"
      @change="handleDropdownChange($event.value)"
    >
      <template #display>
        <AttemptLogItem
          class="attempt-selected"
          :isSurvey="isSurvey"
          :attemptLog="attemptLogs[selectedQuestionNumber]"
          displayTag="span"
        />
      </template>
      <template #option="{ index }">
        <AttemptLogItem
          class="attempt-option"
          :isSurvey="isSurvey"
          :attemptLog="attemptLogs[index]"
          displayTag="span"
        />
      </template>
    </KSelect>

    <AccordionContainer
      v-else
      :hideTopActions="true"
      :items="sections"
      :style="{ backgroundColor: $themeTokens.surface }"
    >
      <AccordionItem
        v-for="(section, index) in sections"
        :id="`section-questions-${index}`"
        :key="`section-questions-${index}`"
        :title="section.section_title"
        @focus="expand(index)"
      >
        <template #heading="{ title }">
          <h3 class="accordion-header">
            <KButton
              tabindex="0"
              appearance="basic-link"
              :style="accordionStyleOverrides"
              class="accordion-header-label"
              :aria-expanded="isExpanded(index)"
              :aria-controls="`section-question-panel-${index}`"
              @click="toggle(index)"
            >
              <span>{{ title }}</span>
              <KIcon
                class="chevron-icon"
                :icon="(isExpanded(index)) ?
                  'chevronUp' : 'chevronRight'"
              />
            </KButton>
          </h3>
        </template>
        <template #content>
          <div
            v-show="isExpanded(index)"
            :style="{
              backgroundColor: $themePalette.grey.v_100,
            }"
          >
            <ul
              ref="attemptList"
              class="history-list"
              role="listbox"
              @keydown.home="setSelectedAttemptLog(0)"
              @keydown.end="
                setSelectedAttemptLog(attemptLogs.length - 1)"
              @keydown.up.prevent="
                setSelectedAttemptLog(previousQuestion(selectedQuestionNumber))"
              @keydown.left.prevent="
                setSelectedAttemptLog(previousQuestion(selectedQuestionNumber))"
              @keydown.down.prevent="
                setSelectedAttemptLog(nextQuestion(selectedQuestionNumber))"
              @keydown.right.prevent="
                setSelectedAttemptLog(nextQuestion(selectedQuestionNumber))"
            >
              <li
                v-for="(question, qIndex) in section.questions"
                :key="`attempt-item-${qIndex}`"
                class="attempt-item"
                :style="{
                  backgroundColor: isSelected(qIndex) ? $themePalette.grey.v_100 : '',
                }"
              >
                <a
                  ref="attemptListOption"
                  role="option"
                  class="attempt-item-anchor"
                  :aria-selected="isSelected(qIndex).toString()"
                  :tabindex="isSelected(qIndex) ? 0 : -1"
                  @click.prevent="setSelectedAttemptLog(qIndex)"
                  @keydown.enter="setSelectedAttemptLog(qIndex)"
                  @keydown.space.prevent="setSelectedAttemptLog(qIndex)"
                >
                  <AttemptLogItem
                    :isSurvey="isSurvey"
                    :attemptLog="attemptLogs[qIndex]"
                    displayTag="p"
                  />
                </a>
              </li>
            </ul>
          </div>
        </template>
      </AccordionItem>
    </AccordionContainer>
  </div>

</template>


<script>

  import useAccordion from 'kolibri-common/components/useAccordion';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import AccordionItem from 'kolibri-common/components/AccordionItem';
  import AccordionContainer from 'kolibri-common/components/AccordionContainer';
  import { watch } from 'kolibri.lib.vueCompositionApi';
  import { toRefs } from '@vueuse/core';
  import AttemptLogItem from './AttemptLogItem';

  export default {
    name: 'AttemptLogList',
    components: {
      AttemptLogItem,
      AccordionContainer,
      AccordionItem,
    },
    mixins: [commonCoreStrings],
    setup(props) {
      const { isSurvey, sections, selectedQuestionNumber } = toRefs(props);
      // No need to do this unless "practice quiz" begins to use the same sections structure
      // This means expand, isExpanded, and toggle cannot be referenced in any template code
      // which only shows when isSurvey is true
      if (isSurvey.value) {
        return {};
      }

      const { expand, isExpanded, toggle } = useAccordion(sections);

      /** Finds the section which the current attempt belongs to and expands it */
      function expandCurrentSectionIfNeeded() {
        let qCount = 0;
        for (let i = 0; i < sections.value.length; i++) {
          qCount += sections.value[i].questions.length;
          if (qCount >= selectedQuestionNumber.value) {
            if (!isExpanded(i)) {
              expand(i);
            }
            break;
          }
        }
      }

      watch(selectedQuestionNumber, expandCurrentSectionIfNeeded);
      expandCurrentSectionIfNeeded();

      return {
        expand,
        isExpanded,
        toggle,
      };
    },
    props: {
      sections: {
        type: Array,
        required: true,
      },
      attemptLogs: {
        type: Array,
        required: true,
      },
      isMobile: {
        type: Boolean,
        required: false,
      },
      selectedQuestionNumber: {
        type: Number,
        required: true,
      },
      isSurvey: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      accordionStyleOverrides() {
        return {
          color: this.$themeTokens.text + '!important',
          textDecoration: 'none',
        };
      },
      selected() {
        return this.options.find(o => o.value === this.selectedQuestionNumber + 1) || {};
      },
      options() {
        let label = '';
        return this.attemptLogs.map(attemptLog => {
          label = this.coreString('questionNumberLabel', {
            questionNumber: attemptLog.questionNumber,
          });
          return {
            value: attemptLog.questionNumber,
            label: label,
          };
        });
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.scrollToSelectedAttemptLog(this.selectedQuestionNumber);
      });
    },
    methods: {
      handleDropdownChange(value) {
        this.$emit('select', value - 1);
      },
      setSelectedAttemptLog(questionNumber) {
        const listOption = this.$refs.attemptListOption[questionNumber];
        listOption.focus();

        this.$emit('select', questionNumber);
        this.scrollToSelectedAttemptLog(questionNumber);
      },
      isSelected(questionNumber) {
        return Number(this.selectedQuestionNumber) === questionNumber;
      },
      scrollToSelectedAttemptLog(questionNumber) {
        let selectedElement;
        if (
          this.$refs.attemptListOption &&
          this.$refs.attemptList &&
          this.$refs.attemptList.children
        ) {
          selectedElement = this.$refs.attemptList.children[questionNumber];
        }
        if (selectedElement) {
          const parent = this.$el.parentElement;
          parent.scrollTop =
            selectedElement.offsetHeight * (questionNumber + 1) - parent.offsetHeight / 2;
        }
      },
      previousQuestion(questionNumber) {
        return questionNumber - 1 >= 0 ? questionNumber - 1 : this.attemptLogs.length - 1;
      },
      nextQuestion(questionNumber) {
        return questionNumber + 1 < this.attemptLogs.length ? questionNumber + 1 : 0;
      },
    },
    $trs: {
      answerHistoryLabel: {
        message: 'Answer history',
        context:
          'Indicates a record of answers that a learner has responded to questions in a quiz, for example.',
      },
    },
  };

</script>


<style lang="scss" scoped>

  .header {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 16px;
    margin: 0;
  }

  .history-list {
    max-height: inherit;
    padding-right: 0;
    padding-left: 0;
    margin: 0;
    text-align: justify;
    list-style-type: none;
  }

  .history-select {
    max-width: 90%;
    padding: 0.5em 0;
    margin: auto;
  }

  /deep/.ui-select-dropdown {
    left: 0;
  }

  .attempt-option {
    position: relative;
    width: calc(100% - 1em);

    /deep/.svg-item {
      position: absolute;
      top: 50%;
      right: 0.5em;
      z-index: 1;
      vertical-align: middle;
      transform: translateY(-50%);
    }
  }

  .attempt-selected {
    /deep/.svg-item {
      position: absolute;
      top: 50%;
      right: 0.5em;
      vertical-align: middle;
      transform: translateY(-50%);
    }
  }

  .attempt-item {
    display: block;
    min-width: 120px;
    clear: both;
  }

  .attempt-item-anchor {
    display: block;
    padding-right: 1vw;
    padding-left: 1vw;
    cursor: pointer;
  }

  .accordion-header-label {
    display: block;
    width: calc(100% - 1em);
    height: 100%;
    padding: 1em;

    // Removes underline from section headings
    /deep/.link-text {
      text-decoration: none;
    }
  }

  .chevron-icon {
    position: absolute;
    top: 50%;
    right: 0.5em;
    vertical-align: middle;
    transform: translateY(-50%);
  }

  .accordion-header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
    text-align: left;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s ease;
  }

</style>

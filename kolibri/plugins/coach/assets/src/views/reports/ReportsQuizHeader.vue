<template>

  <div>
    <BackLinkWithOptions>
      <BackLink
        slot="backlink"
        :to="classRoute('ReportsQuizListPage')"
        :text="$tr('back')"
      />
      <QuizOptionsDropdownMenu
        slot="options"
        optionsFor="report"
        @select="handleSelectOption"
      />
    </BackLinkWithOptions>

    <h1>
      <KLabeledIcon>
        <KIcon slot="icon" quiz />
        {{ exam.title }}
      </KLabeledIcon>
    </h1>

    <HeaderTable>
      <HeaderTableRow :keyText="coachStrings.$tr('statusLabel')">
        <QuizActive
          slot="value"
          :active="exam.active"
        />
      </HeaderTableRow>
      <HeaderTableRow :keyText="coachStrings.$tr('recipientsLabel')">
        <Recipients
          slot="value"
          :groupNames="getGroupNames(exam.groups)"
        />
      </HeaderTableRow>
      <HeaderTableRow :keyText="coachStrings.$tr('avgScoreLabel')">
        <Score slot="value" :value="avgScore" />
      </HeaderTableRow>
      <HeaderTableRow
        :keyText="coachStrings.$tr('questionOrderLabel')"
        :valueText="orderDescriptionString"
      />
    </HeaderTable>

    <HeaderTabs>
      <HeaderTab
        :text="coachStrings.$tr('reportLabel')"
        :to="classRoute('ReportsQuizLearnerListPage')"
      />
      <HeaderTab
        :text="coachStrings.$tr('difficultQuestionsLabel')"
        :to="classRoute('ReportsQuizQuestionListPage')"
      />
    </HeaderTabs>

  </div>

</template>


<script>

  import commonCoach from '../common';
  import QuizOptionsDropdownMenu from '../plan/QuizSummaryPage/QuizOptionsDropdownMenu';
  import BackLinkWithOptions from '../common/BackLinkWithOptions';

  export default {
    name: 'ReportsQuizHeader',
    components: {
      BackLinkWithOptions,
      QuizOptionsDropdownMenu,
    },
    mixins: [commonCoach],
    computed: {
      avgScore() {
        return this.getExamAvgScore(this.$route.params.quizId, this.recipients);
      },
      exam() {
        return this.examMap[this.$route.params.quizId];
      },
      recipients() {
        return this.getLearnersForGroups(this.exam.groups);
      },
      orderDescriptionString() {
        return this.exam.learners_see_fixed_order
          ? this.coachStrings.$tr('orderFixedLabel')
          : this.coachStrings.$tr('orderRandomLabel');
      },
    },
    methods: {
      handleSelectOption(option) {
        if (option === 'EDIT_DETAILS') {
          this.$router.push(this.$router.getRoute('QuizReportEditDetailsPage'));
        }
        if (option === 'PREVIEW') {
          this.$router.push(this.$router.getRoute('ReportsQuizPreviewPage'));
        }
      },
    },
    $trs: {
      back: 'All quizzes',
    },
  };

</script>


<style lang="scss" scoped>

  .stats {
    margin-right: 16px;
  }

</style>

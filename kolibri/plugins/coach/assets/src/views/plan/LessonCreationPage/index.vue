<template>

  <CoachImmersivePage
    :appBarTitle="coachString('createLessonAction')"
    :authorized="true"
    authorizedRole="adminOrCoach"
    icon="close"
    :pageTitle="coachString('createLessonAction')"
    :route="{ name: 'PLAN_LESSONS_ROOT', params: { classId } }"
  >
    <KPageContainer>
      <AssignmentDetailsModal
        ref="detailsModal"
        assignmentType="lesson"
        :assignment="{ assignments: [classId] }"
        :classId="classId"
        :groups="groups"
        :disabled="false"
        @submit="createLesson"
        @cancel="() => $router.go(-1)"
      />
    </KPageContainer>
    <SidePanelModal
      v-if="showSidePanel"
      ref="resourcePanel"
      alignment="right"
      sidePanelWidth="700px"
      closeButtonIconType="close"
      @closePanel="() => null"
    >
      <template #header>
        <KIconButton
          v-if="true"
          icon="back"
          @click="$router.go(-1)"
        />
      </template>
      <router-view @closePanel="() => null" />
    </SidePanelModal>
  </CoachImmersivePage>

</template>


<script>

  import SidePanelModal from 'kolibri-common/components/SidePanelModal';
  import { ERROR_CONSTANTS } from 'kolibri.coreVue.vuex.constants';
  import CatchErrors from 'kolibri.utils.CatchErrors';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import AssignmentDetailsModal from '../assignments/AssignmentDetailsModal';
  import commonCoach from '../../common';
  import { LessonsPageNames } from '../../../constants/lessonsConstants';
  import CoachImmersivePage from '../../CoachImmersivePage';

  export default {
    name: 'LessonCreationPage',
    components: {
      AssignmentDetailsModal,
      CoachImmersivePage,
      SidePanelModal,
    },
    mixins: [commonCoach, commonCoreStrings],
    computed: {
      showSidePanel() {
        return this.$route.name !== LessonsPageNames.LESSON_CREATION_ROOT;
      },
      classId() {
        return this.$route.params.classId;
      },
    },
    created() {
      const initClassInfoPromise = this.$store.dispatch('initClassInfo', this.classId);
      const getFacilitiesPromise =
        this.isSuperuser && this.$store.state.core.facilities.length === 0
          ? this.$store.dispatch('getFacilities').catch(() => {})
          : Promise.resolve();

      Promise.all([initClassInfoPromise, getFacilitiesPromise]);
    },
    mounted() {
      this.$store.commit('CORE_SET_PAGE_LOADING', false);
    },
    methods: {
      createLesson(payload) {
        this.$store
          .dispatch('lessonsRoot/createLesson', {
            classId: this.classId,
            payload,
          })
          .then(() => {
            this.showSnackbarNotification('lessonCreated');
          })
          .catch(error => {
            const errors = CatchErrors(error, [ERROR_CONSTANTS.UNIQUE]);
            if (errors) {
              this.$refs.detailsModal.handleSubmitTitleFailure();
            } else {
              this.$refs.detailsModal.handleSubmitFailure();
            }
          });
      },
    },
  };

</script>


<style lang="scss" scoped></style>

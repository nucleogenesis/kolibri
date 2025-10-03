<template>

  <FacilityAppBarPage
    class="wrapper"
    :appearanceOverrides="{
      width: '100%',
      height: '100vh',
      margin: '0px',
      padding: '0px',
    }"
  >
    <template>
      <div :style="containerStyles">
        <div
          class="header-shadow"
          :style="headerStyles"
        >
          <KRouterLink
            v-if="userIsMultiFacilityAdmin"
            :to="{
              name: $store.getters.facilityPageLinks.AllFacilitiesPage.name,
              params: { subtopicName: 'UserPage' },
            }"
            icon="back"
            :text="coreString('changeLearningFacility')"
          />

          <UsersTableToolbar
            :filterPageName="PageNames.FILTER_USERS_SIDE_PANEL"
            :selectedUsers="selectedUsers"
            :numAppliedFilters="numAppliedFilters"
          >
            <template #topRow>
              <div class='users-header-top'>
                <h1>{{ coreString('usersLabel') }}</h1>
                <FilterTextbox
                  ref="filterTextboxRef"
                  v-model="searchTerm"
                  :placeholder="coreString('searchForUser')"
                  :aria-label="coreString('searchForUser')"
                  class="move-down search-box"
                />
                <KRouterLink
                  appearance="basic-link"
                  :text="numAppliedFilters ? numFilters$({ n: numAppliedFilters }) : filterLabel$()"
                  class="filter-button move-down"
                  :to="overrideRoute($route, { name: PageNames.FILTER_USERS_SIDE_PANEL })"
                />
              </div>
              <div class="users-page-header-actions">
                <KButton
                  hasDropdown
                  :primary="false"
                  :text="coreString('optionsLabel')"
                >
                  <template #menu>
                    <KDropdownMenu
                      :options="pageDropdownOptions"
                      @select="handlePageDropdownSelection"
                    />
                  </template>
                </KButton>
                <KRouterLink
                  primary
                  appearance="raised-button"
                  :text="newUser$()"
                  :to="$store.getters.facilityPageLinks.UserCreatePage"
                />
              </div>
            </template>
            <template #bottomRow>
              <div style="display:flex;justify-content:space-between;">
                <div>
                  <KIconButton
                    ref="assignButton"
                    icon="assignCoaches"
                    :ariaLabel="assignCoach$()"
                    :disabled="!canAssignCoaches || !hasSelectedUsers"
                    @click="navigateToSidePanel(PageNames.ASSIGN_COACHES_SIDE_PANEL)"
                  />
                  <KTooltip
                    reference="assignButton"
                    :refs="$refs"
                    :text="assignCoach$()"
                  />
                  <KIconButton
                    ref="enrollButton"
                    icon="add"
                    :ariaLabel="enrollToClass$()"
                    :disabled="!canEnrollOrRemoveFromClass || !hasSelectedUsers"
                    @click="navigateToSidePanel(PageNames.ENROLL_LEARNERS_SIDE_PANEL)"
                  />
                  <KTooltip
                    reference="enrollButton"
                    :refs="$refs"
                    :text="enrollToClass$()"
                  />
                  <KIconButton
                    ref="removeButton"
                    icon="remove"
                    :ariaLabel="removeFromClass$()"
                    :disabled="!canEnrollOrRemoveFromClass || !hasSelectedUsers"
                    @click="navigateToSidePanel(PageNames.REMOVE_FROM_CLASSES_SIDE_PANEL)"
                  />
                  <KTooltip
                    reference="removeButton"
                    :refs="$refs"
                    :text="removeFromClass$()"
                  />
                  <KIconButton
                    ref="trashButton"
                    icon="trash"
                    :ariaLabel="deleteSelectionTooltip"
                    :disabled="!canDeleteSelection || !hasSelectedUsers"
                    @click="isMoveToTrashModalOpen = true"
                  />
                  <KTooltip
                    reference="trashButton"
                    :refs="$refs"
                    :text="deleteSelectionTooltip"
                  />
                </div>
  <nav>
    <div class="pagination-actions">
      <span
        dir="auto"
        class="pagination-label"
      >
                      pagination message
      </span>
      <KButtonGroup>
        <KIconButton
          :ariaLabel="$tr('previousResults')"
          :disabled="previousButtonDisabled"
          size="small"
          icon="back"
          @click="changePage(-1)"
        />
        <KIconButton
          :ariaLabel="$tr('nextResults')"
          :disabled="nextButtonDisabled"
          size="small"
          icon="forward"
          @click="changePage(+1)"
        />
      </KButtonGroup>
    </div>
  </nav>
              </div>
            </template>
          </UsersTableToolbar>
        </div>
        <UsersTable
          class="users-table"
          :facilityUsers="facilityUsers"
          :usersCount="usersCount"
          :totalPages="totalPages"
          :dataLoading="dataLoading"
          :selectedUsers.sync="selectedUsers"
          :filterPageName="PageNames.FILTER_USERS_SIDE_PANEL"
          :numAppliedFilters="numAppliedFilters"
          @clearSelectedUsers="clearSelectedUsers"
          @clearFilters="resetFilters"
          @change="onChange"
        />
        <!-- For sidepanels -->
        <router-view
          :selectedUsers="selectedUsers"
          :classes="classes"
          :onBlur="onModalBlur"
          :onChange="onChange"
          @clearSelection="clearSelectedUsers"
        />

        <!-- Modals -->
        <MoveToTrashModal
          v-if="isMoveToTrashModalOpen"
          :selectedUsers="selectedUsers"
          :onBlur="onModalBlur"
          :onChange="onChange"
          @close="isMoveToTrashModalOpen = false"
        />
      </div>
    </template>
  </FacilityAppBarPage>

</template>


<script>

  import clamp from 'lodash/clamp';
import pickBy from 'lodash/pickBy';
import debounce from 'lodash/debounce';
  import FilterTextbox from 'kolibri/components/FilterTextbox';

  import { ref, computed, onBeforeUnmount, getCurrentInstance, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router/composables';
  import commonCoreStrings from 'kolibri/uiText/commonCoreStrings';
  import useFacilities from 'kolibri-common/composables/useFacilities';
  import { bulkUserManagementStrings } from 'kolibri-common/strings/bulkUserManagementStrings';
  import useUser from 'kolibri/composables/useUser';
  import { UserKinds } from 'kolibri/constants';
  import usePreviousRoute from 'kolibri-common/composables/usePreviousRoute';
  import UsersTableToolbar from '../common/UsersTableToolbar';
  import useUserManagement from '../../../composables/useUserManagement';
  import FacilityAppBarPage from '../../FacilityAppBarPage';
  import { PageNames } from '../../../constants';
  import UsersTable from '../common/UsersTable.vue';
  import { overrideRoute } from '../../../utils';
  import MoveToTrashModal from '../common/MoveToTrashModal.vue';

  export default {
    name: 'UsersRootPage',
    metaInfo() {
      return {
        title: this.coreString('usersLabel'),
      };
    },
    components: {
      UsersTable,
      UsersTableToolbar,
      MoveToTrashModal,
      FacilityAppBarPage,
    FilterTextbox
    },
    mixins: [commonCoreStrings],
  setup(_, { expose }) {
      usePreviousRoute();
      const route = useRoute();
      const router = useRouter();
      const { currentUserId, isSuperuser, isAdmin } = useUser();
      const { userIsMultiFacilityAdmin } = useFacilities();
      const isMoveToTrashModalOpen = ref(false);

      const {
        newUser$,
        viewTrash$,
        assignCoach$,
        viewNewUsers$,
        enrollToClass$,
        removeFromClass$,
        deleteSelection$,
        cannotDeleteSelfTooltip$,
        numFilters$,
        filterLabel$,
        numUsersSelected$,
        clearFiltersLabel$,
      } = bulkUserManagementStrings;

      const { $store, $router } = getCurrentInstance().proxy;
      const activeFacilityId =
        $router.currentRoute.params.facility_id || $store.getters.activeFacilityId;
      const {
        selectedUsers,
        facilityUsers,
        totalPages,
        usersCount,
        dataLoading,
        classes,
        numAppliedFilters,
        onChange,
        fetchClasses,
        resetFilters,
      } = useUserManagement({ activeFacilityId });

      onMounted(() => {
        fetchClasses();
      });

      function clearSelectedUsers() {
        selectedUsers.value = new Set();
      }

      function onModalBlur() {
        selectedUsers.value.clear();
        selectedUsers.value = new Set(selectedUsers.value);
      }

      function navigateToSidePanel(sidePanelName) {
        const newRoute = overrideRoute(route, { name: sidePanelName });
        router.push(newRoute);
      }

    const filterTextboxRef = ref(null);
    const emitSearchTerm = value => {
      if (value === '') {
        value = null;
      }
      router.push({
        ...route,
        query: pickBy({
          ...route.query,
          search: value,
          page: null,
        }),
      });
    };
    const debouncedSearchTerm = debounce(emitSearchTerm, 300);

    const searchTerm = computed({
      get() {
        return route.query.search || '';
      },
      set(value) {
        debouncedSearchTerm(value);
      },
    });

    onBeforeUnmount(() => {
      const { query } = route;
      if (query.ordering || query.order || query.page) {
        router.replace({ query: null });
      }
    });

    const focus = () => {
      filterTextboxRef.value?.focus();
    };

    expose({
      focus,
    });
   const itemsPerPage = computed({
        get() {
          return Number(route.query.page_size) || 30;
        },
        set(value) {
          router.push({
            ...route,
            query: pickBy({
              ...route.query,
              page_size: value,
              page: null,
            }),
          });
        },
      });


      return {
        overrideRoute,
        searchTerm,
        filterTextboxRef,
        numFilters$,
        filterLabel$,
        numUsersSelected$,
        clearFiltersLabel$,
        PageNames,
        userIsMultiFacilityAdmin,
        facilityUsers,
        totalPages,
        usersCount,
        dataLoading,
        classes,
        numAppliedFilters,
        isMoveToTrashModalOpen,
        onChange,
        onModalBlur,
        resetFilters,
        clearSelectedUsers,
        newUser$,
        viewTrash$,
        assignCoach$,
        viewNewUsers$,
        enrollToClass$,
        removeFromClass$,
        deleteSelection$,
        cannotDeleteSelfTooltip$,
        selectedUsers,
        currentUserId,
        isSuperuser,
        isAdmin,
        overrideRoute,
        navigateToSidePanel,
        numFilters$,
        filterLabel$,
        numUsersSelected$,
        clearFiltersLabel$,
      };
    },
    computed: {
      startRange() {
        return (this.value - 1) * this.itemsPerPage;
      },
      visibleStartRange() {
        return Math.min(this.startRange + 1, this.numFilteredItems);
      },
      endRange() {
        return this.value * this.itemsPerPage;
      },
      visibleEndRange() {
        return Math.min(this.endRange, this.numFilteredItems);
      },
      previousButtonDisabled() {
        return this.value === 1 || this.numFilteredItems === 0;
      },
      nextButtonDisabled() {
        return (
          this.totalPageNumber === 1 ||
          this.value === this.totalPageNumber ||
          this.numFilteredItems === 0
        );
      },
      pageDropdownOptions() {
        return [
          {
            label: this.viewNewUsers$(),
            id: 'view_new_users',
            value: PageNames.NEW_USERS_PAGE,
          },
          {
            label: this.viewTrash$(),
            id: 'view_trash',
            value: PageNames.USERS_TRASH_PAGE,
          },
        ];
      },
      hasSelectedUsers() {
        return this.selectedUsers && this.selectedUsers.size > 0;
      },
      listContainsLoggedInUser() {
        return this.selectedUsers.has(this.currentUserId);
      },
      canAssignCoaches() {
        if (!this.hasSelectedUsers) return false;
        return this.facilityUsers
          .filter(user => this.selectedUsers.has(user.id))
          .some(
            user =>
              user.kind.includes(UserKinds.COACH) ||
                user.kind === UserKinds.ADMIN ||
                user.kind === UserKinds.SUPERUSER ||
                user.is_superuser,
          );
      },
      canEnrollOrRemoveFromClass() {
        if (!this.hasSelectedUsers) return false;
        return this.facilityUsers
          .filter(user => this.selectedUsers.has(user.id))
          .every(
            user =>
              user.kind === UserKinds.LEARNER ||
                user.kind.includes(UserKinds.COACH) ||
                user.kind === UserKinds.ADMIN ||
                user.kind === UserKinds.SUPERUSER ||
                user.is_superuser,
          );
      },
      hasSelectedSuperusers() {
        if (!this.hasSelectedUsers || !this.facilityUsers) return false;
        return this.facilityUsers
          .filter(user => this.selectedUsers.has(user.id))
          .some(user => {
            const isSuperuser = user.kind === UserKinds.SUPERUSER || user.is_superuser === true;
            return isSuperuser;
          });
      },
      canDeleteSelection() {
        if (!this.hasSelectedUsers) return false;
        if (this.listContainsLoggedInUser) return false;
        if (this.isSuperuser) return true;
        if (this.isAdmin) {
          return !this.hasSelectedSuperusers;
        }
        return false;
      },
      deleteSelectionTooltip() {
        if (this.listContainsLoggedInUser) {
          return this.cannotDeleteSelfTooltip$();
        }
        return this.deleteSelection$();
      },
      headerStyles() {
        return {
          padding: '16px',
        };
      },
      containerStyles() {
        return {
          paddingTop: '64px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: 'white',
        };
      },
    },
    methods: {
      changePage(change) {
        // Clamp the newPage number between the bounds if browser doesn't correctly
        // disable buttons (see #6454 issue with old versions of MS Edge)
        this.$emit('input', clamp(this.value + change, 1, this.totalPageNumber));
      },
      handlePageDropdownSelection(option) {
        if (option.value) {
          this.$router.push({
            name: option.value,
            params: { facility_id: this.$store.getters.activeFacilityId },
          });
        }
      },
    },
    $trs: {
      previousResults: {
        message: 'Previous results',
        context:
          'Text which indicates the previous page of results when a user makes a search query.\n',
      },
      nextResults: {
        message: 'Next results',
        context: 'Text which indicates the next page of results when a user makes a search query.',
      },
      pagination: {
        message:
          '{ visibleStartRange, number } - { visibleEndRange, number } of { numFilteredItems, number }',
        context: "Refers to pagination. Only translate the word \"of''.",
      },
    },
  };

</script>


<style lang="scss" scoped>

.users-page-header {
display: flex;
gap: 16px;
align-items: center;
justify-content: space-between;
margin-bottom: 0.5em;


.users-page-header-actions {
display: flex;
flex-wrap: wrap;
gap: 16px;
align-items: center;
justify-content: flex-end;
}
}

.users-container {
display: flex;
flex-direction: column;
height: 100%;
// top: 4em (app bar) + 2em (internal padding)
padding: 6em 2em 1em;
// !important to override
margin: 0 !important;
background-color: white;
}

/deep/ .main-wrapper {
// The default padding causes root scroll which defeats
// the purpose of our maxHeight style on the KPageContainer.
// Uses !important because the overridden style is inline
padding-bottom: 0 !important;
}

.header-shadow {
z-index: 4;
box-shadow:
0 0 2px rgba(0, 0, 0, 0.12),
0 2px 2px rgba(0, 0, 0, 0.2);
}

.move-down {
position: relative;
}

.search-box {
display: inline-block;
width: 100%;
}

.users-header-top {
display: flex;
align-items: center;
gap: 1em;
}
</style>

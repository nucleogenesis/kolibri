import { ClassroomResource } from 'kolibri.resources';

export function showClassesPage(store, toRoute) {
  store.dispatch('preparePage');
  store.commit('classManagement/SET_STATE', { dataLoading: true });
  const facilityId = toRoute.params.facility_id || store.getters.activeFacilityId;
  return ClassroomResource.fetchCollection({
    getParams: { parent: facilityId },
    force: true,
  })
    .then(classrooms => {
      store.commit('classManagement/SET_STATE', {
        modalShown: false,
        classes: [...classrooms],
      });
      store.dispatch('notLoading');
      store.commit('classManagement/SET_STATE', { dataLoading: false });
    })
    .catch(error => {
      store.dispatch('notLoading');
      store.dispatch('handleError', error);
      store.commit('classManagement/SET_STATE', { dataLoading: false });
    });
}

import { FacilityResource, FacilityDatasetResource } from 'kolibri.resources';

export function showFacilityConfigPage(store, toRoute) {
  const facilityId = toRoute.params.facility_id || store.getters.activeFacilityId;
  store.dispatch('preparePage');
  const resourceRequests = [
    FacilityResource.fetchModel({ id: facilityId }),
    FacilityDatasetResource.fetchCollection({ getParams: { facility_id: facilityId } }),
    FacilityResource.fetchCollection({ force: true }),
  ];

  return Promise.all(resourceRequests)
    .then(([facility, facilityDatasets, facilities]) => {
      const dataset = facilityDatasets[0]; // assumes for now is only one facility being managed
      store.commit('facilityConfig/SET_STATE', {
        facilityDatasetId: dataset.id,
        facilityName: facility.name,
        facilityId: facility.id,
        // this part of state is mutated as user interacts with form
        settings: { ...dataset },
        // this copy is kept for the purpose of undoing if save fails
        settingsCopy: { ...dataset },
        facilities: facilities,
      });
      store.dispatch('notLoading').then(() => console.log('NOT LOADING!'));
    })
    .catch(() => {
      store.commit('facilityConfig/SET_STATE', {
        facilityName: '',
        settings: null,
      });
      store.dispatch('notLoading');
    });
}

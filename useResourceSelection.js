

/**
 * @param visibleResources - Ref<string[]> - list of ids of resources that are visible
 * @param disabledResources - Ref<string[]> - list of ids that are not able to be toggled
 */
export function useResourceSelection(visibleResources = ref([]), isResourceDisabled = () => false) {

  // Maintains a list of all resources selected by their IDs
  const selectedResources = ref([]);

  // Functions to call when a checkbox changes
  function selectResource(id) { 
    if (isResourceDisabled(id)) { return; };
    selectedResources.value = uniq(selectedResources.value.push(id)) 
  };

  function deselectResource(id) { 
    if (isResourceDisabled(id)) { return; };
    selectedResources.value = selectedResources.value.filter(r => r.id !== id)
  }

  function toggleResource(id) {
    isResourceChecked(id) ? deselectResource(id) : selectResource(id);
  }

  // Predicate functions to determine if a resource's current state
  function isResourceChecked(id) { return selectedResources.value.includes(id) }

  const selectAllChecked = computed(() => visibleResources.value.every(r => selectedResources.includes(r.id)));
  const selectAllIndeterminate = computed(() => !selectAllChecked() && visibleResources.value.some(r => selectedResources.includes(r.id)))
  
  return {
    // Data
    selectedResources,
    selectAllChecked,
    selectAllIndeterminate,

    // Methods
    isResourceChecked,
    toggleResource,
  };  
}



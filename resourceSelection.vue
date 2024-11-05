<template>
  <div v-for="resource in visibleResources">
    <KCheckbox
      :checked="isResourceSelected(resource.id)"
      :change="toggleResource"
      :disabled="isResourceDisabled(id)"
    />
    <span> The Resource! </span>
  </div>
</template>


<script>

  export default {
    name: 'ResourceSelection',
    setup() {
      const visibleResources = ref([]);

      function isResourceDisabled(id) {
        return true || false;
      }

      // Just pseudocode, we get the resources somehow
      function fetchEm() { ContentNodeResource.fetchTree().then((data) => visibleResources = data)}
      watch($route, fetchEm); // Fetch more, etc, not important here

      const { 
        // Data
        selectedResources,
        selectAllChecked,
        selectAllIndeterminate,

        // Methods
        isResourceChecked,
        toggleResource,
      } = useResourceSelection(visibleResources, isResourceDisabled)

      return {
        isResourceSelected,
        isResourceDisabled,
        toggleResource,
      }
    }
  }

</script>

export default {
  props: ['dom'],
  computed: {
    children() {
      return Array.from(this.dom.children);
    }
  }
}

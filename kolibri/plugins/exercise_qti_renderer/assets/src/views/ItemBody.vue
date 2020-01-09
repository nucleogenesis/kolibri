<template>

  <div>
    <div v-for="child in children" :key="child.id">
      <div v-if="isValidHtml(child)" v-html="htmlSerialize(child)">
      </div>

      <component :is="child.tagName" v-else :dom="child" @submit="$emit('submit', $event)" />

    </div>
  </div>

</template>


<script>

  import domMixin from '../mixins/domMixin';
  import ChoiceInteraction from './interactions/ChoiceInteraction';

  export default {
    name: 'ItemBody',
    components: { ChoiceInteraction },
    mixins: [domMixin],
    methods: {
      isValidHtml(htmlElement) {
        const whiteList = [
          'a',
          'b',
          'blockquote',
          'br',
          'caption',
          'cite',
          'code',
          'col',
          'hr',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'h7',
          'h8',
          'del',
          'ins',
          'iframe',
          'colgroup',
          'dd',
          'div',
          'dl',
          'dt',
          'em',
          'i',
          'img',
          'li',
          'ol',
          'p',
          'pre',
          'q',
          'small',
          'span',
          'strike',
          'strong',
          'sub',
          'sup',
          'table',
          'tbody',
          'td',
          'tfoot',
          'th',
          'thead',
          'tr',
          'u',
          'ul',
          'object',
          'embed',
          'param',
          'video',
          'track',
          'audio',
        ];

        return whiteList.some(elementName => htmlElement.tagName === elementName);
      },
      htmlSerialize(htmlElement) {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(htmlElement);
      },
    },
  };

</script>

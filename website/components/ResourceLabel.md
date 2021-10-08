# ResourceLabel

Renders learning activity/topic icon, title, and (when available) learning activity duration of a resource.

## Props

<!-- @vuese:ResourceLabel:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|contentNode|-|`Object`|`true`|-|
|contentNodeRoute|vue-router link object If provided, a resource title will be rendered as a link targeting this route.|`Object`|`false`|null|
|disableLinkFocus|Sets `tabindex` of a link to -1. Useful when a parent element behaves like a link itself and we only want to display focus ring for that element.|`Boolean`|`false`|false|
|hideIcon|-|`Boolean`|`false`|false|
|condensed|The icon renders smaller and is moved next to the title in `condensed` mode.|`Boolean`|`false`|false|

<!-- @vuese:ResourceLabel:props:end -->

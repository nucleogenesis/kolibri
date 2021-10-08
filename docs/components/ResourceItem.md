# ResourceItem

Renders title, learning activity/topic icon, and (when available) learning activity duration. A thumbnail is displayed for larger sizes. It can be rendered as a link.

## Props

<!-- @vuese:ResourceItem:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|contentNode|-|`Object`|`true`|-|
|contentNodeRoute|vue-router link object The whole component behaves like a link when provided.|`Object`|`false`|null|
|size|Can be'small', 'medium', or 'large' Only learning activity icon, title, and duration is displayed when 'small'. In addition, a resource thumbnail is displayed for both 'medium' and 'large'. The thumbnail and text is stacked horizontally for 'medium' whereas for 'large' it's stacked vertically and the thumbnail is larger.|`String`|`false`|small|

<!-- @vuese:ResourceItem:props:end -->

# CompletionModalSection

A responsive section of the completion modal. It renders section icon, title, description, and an optional action button/link in the first row. Any content can be passed through the default slot to the area below the description in the second row. For smaller resolutions, the icon isn't displayed and the button/link is placed to the bottom of the section instead of the first row. Emits `buttonClick` event when the action button is not a link.

## Props

<!-- @vuese:CompletionModalSection:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|title|-|`String`|`true`|-|
|icon|-|`String`|`true`|-|
|description|-|`String`|`false`|-|
|buttonLabel|A label of the action button/link. It won't be displayed if a label is not provided.|`String`|`false`|-|
|buttonRoute|vue-router link object The action button is rendered as a link targeting this route if provided, otherwise it's rendered as a button that emits `buttonClick` event.|`Object`|`false`|null|

<!-- @vuese:CompletionModalSection:props:end -->


## Events

<!-- @vuese:CompletionModalSection:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|buttonClick|-|-|

<!-- @vuese:CompletionModalSection:events:end -->


## Slots

<!-- @vuese:CompletionModalSection:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|default|-|-|

<!-- @vuese:CompletionModalSection:slots:end -->


## MixIns

<!-- @vuese:CompletionModalSection:mixIns:start -->
|MixIn|
|---|
|KResponsiveWindowMixin|

<!-- @vuese:CompletionModalSection:mixIns:end -->

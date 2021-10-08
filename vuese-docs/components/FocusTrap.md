# FocusTrap

This component ensures that focus moves between the first element and the last element of content provided by the default slot. In disabled state, it only renders whatever has been passed to the default slot, and doesn't add any focus trap behavior, allowing for flexible use from parent components.

## Props

<!-- @vuese:FocusTrap:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|firstEl|-|`HTMLElement`|`false`|null|
|lastEl|-|`HTMLElement`|`false`|null|
|disabled|-|`Boolean`|`false`|false|

<!-- @vuese:FocusTrap:props:end -->


## Slots

<!-- @vuese:FocusTrap:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|default|-|-|

<!-- @vuese:FocusTrap:slots:end -->

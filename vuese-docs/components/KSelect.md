# KSelect

Used to select or filter items

## Props

<!-- @vuese:KSelect:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|value|Object currently selected|`Object`|`true`|-|
|options|Array of option objects { value, label, disabled }. Disabled key is optional|`Array`|`true`|-|
|label|Label|`String`|`true`|-|
|disabled|Whether disabled or not|`Boolean`|`false`|false|
|invalid|Whether invalid or not|`Boolean`|`false`|false|
|invalidText|Text displayed if invalid|`String`|`false`|null|
|inline|Whether or not display as inline block|`Boolean`|`false`|false|
|floatingLabel|-|`Boolean`|`false`|true|
|placeholder|-|`String`|`false`|null|

<!-- @vuese:KSelect:props:end -->


## Events

<!-- @vuese:KSelect:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|change|Emits new selection.|-|
|blur|-|-|

<!-- @vuese:KSelect:events:end -->

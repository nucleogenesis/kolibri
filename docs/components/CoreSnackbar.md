# CoreSnackbar

Snackbars are used to display notification.

## Props

<!-- @vuese:CoreSnackbar:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|text|Text of notification to be displayed|`String`|`true`|-|
|actionText|To provide an action button, provide text|`String`|`false`|null|
|autoDismiss|Automatically dismiss the snackbar|`Boolean`|`false`|false|
|duration|Duration that the snackbar is visible before it is automatically dismissed|`Number`|`false`|4000|
|backdrop|Show a backdrop to prevent interaction with the page|`Boolean`|`false`|false|
|bottomPosition|Integer that over-rides the default 'bottom: 0' CSS|`Number`|`false`|null|

<!-- @vuese:CoreSnackbar:props:end -->


## Events

<!-- @vuese:CoreSnackbar:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|hide|-|-|
|actionClicked|-|-|

<!-- @vuese:CoreSnackbar:events:end -->

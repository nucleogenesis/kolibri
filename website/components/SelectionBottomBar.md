# SelectionBottomBar

Shows a 'EXPORT', 'IMPORT', or 'DELETE' button next to a message of how many items are selected plus their size.

## Props

<!-- @vuese:SelectionBottomBar:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|selectedObjects|TODO remove this and only pass in resourceCounts object|`Array`|`false`|[]|
|resourceCounts|-|`Object`|`false`|{}|
|objectType|-|`String`|`false`|null|
|actionType|-|`String`|`false`|null|

<!-- @vuese:SelectionBottomBar:props:end -->


## Events

<!-- @vuese:SelectionBottomBar:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|selectoption|-|-|
|clickconfirm|-|-|

<!-- @vuese:SelectionBottomBar:events:end -->


## MixIns

<!-- @vuese:SelectionBottomBar:mixIns:start -->
|MixIn|
|---|
|commonCoreStrings|
|responsiveWindowMixin|

<!-- @vuese:SelectionBottomBar:mixIns:end -->

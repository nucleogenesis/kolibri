# ScrollingHeader

## Props

<!-- @vuese:ScrollingHeader:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|scrollPosition|Current scroll offset of content pane|`Number`|`true`|-|
|alwaysVisible|If 'true', keeps the header permanently pinned to the top|`Boolean`|`false`|false|
|mainWrapperScrollHeight|The scrollable height of the content area|`Number`|`false`|100|
|isHidden|Synced with CoreBase to handle changes when window is resized|`Boolean`|`false`|false|
|skipNextUpdate|This can be used to override automatic hiding/showing updates|`Boolean`|`false`|false|

<!-- @vuese:ScrollingHeader:props:end -->


## Slots

<!-- @vuese:ScrollingHeader:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|default|-|-|

<!-- @vuese:ScrollingHeader:slots:end -->

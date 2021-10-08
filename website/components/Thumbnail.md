# Thumbnail

Displays a thumbnail in 16:9 ratio. A thumbnail image with a different aspect ratio will be letterboxed to fit 16:9. If a thumbnail image is not available, an icon from `icon` slot will be displayed when provided (the icon can also acts as a placeholder before the image is loaded) on top of gray placeholder background.

## Props

<!-- @vuese:Thumbnail:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|thumbnailUrl|-|`String`|`false`|-|
|rounded|-|`Boolean`|`false`|false|

<!-- @vuese:Thumbnail:props:end -->


## Slots

<!-- @vuese:Thumbnail:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|icon|-|-|

<!-- @vuese:Thumbnail:slots:end -->

# ChannelCard

## Props

<!-- @vuese:ChannelCard:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|title|-|`String`|`true`|-|
|tagline|-|`String`|`false`|null|
|thumbnail|-|`String`|`false`|null|
|kind|-|`String`|`true`|-|
|numCoachContents|ContentNode.coach_content will be `0` if not a coach content leaf node, or a topic without coach content. It will be a positive integer if a topic with coach content, and `1` if a coach content leaf node.|`Number`|`false`|0|
|progress|-|`Number`|`false`|0.0|
|link|-|`Object`|`true`|-|
|isMobile|-|`Boolean`|`false`|false|

<!-- @vuese:ChannelCard:props:end -->


## MixIns

<!-- @vuese:ChannelCard:mixIns:start -->
|MixIn|
|---|
|responsiveWindowMixin|

<!-- @vuese:ChannelCard:mixIns:end -->

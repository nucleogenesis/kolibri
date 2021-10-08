# ContentCard

## Props

<!-- @vuese:ContentCard:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|title|-|`String`|`true`|-|
|subtitle|-|`String`|`false`|null|
|thumbnail|-|`String`|`false`|null|
|channelThumbnail|-|`String`|`false`|null|
|channelTitle|-|`String`|`false`|null|
|kind|-|`String`|`true`|-|
|isLeaf|-|`Boolean`|`true`|-|
|numCoachContents|ContentNode.coach_content will be `0` if not a coach content leaf node, or a topic without coach content. It will be a positive integer if a topic with coach content, and `1` if a coach content leaf node.|`Number`|`false`|0|
|progress|-|`Number`|`false`|0.0|
|link|-|`Object`|`true`|-|
|isMobile|-|`Boolean`|`false`|false|
|contentId|-|`String`|`false`|null|
|copiesCount|-|`Number`|`false`|null|

<!-- @vuese:ContentCard:props:end -->


## Events

<!-- @vuese:ContentCard:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|toggleOptions|-|-|
|toggleInfoPanel|-|-|
|openCopiesModal|-|-|

<!-- @vuese:ContentCard:events:end -->


## Slots

<!-- @vuese:ContentCard:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|actions|-|-|

<!-- @vuese:ContentCard:slots:end -->


## MixIns

<!-- @vuese:ContentCard:mixIns:start -->
|MixIn|
|---|
|commonLearnStrings|
|commonCoreStrings|

<!-- @vuese:ContentCard:mixIns:end -->

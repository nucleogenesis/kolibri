# LessonContentCard

## Props

<!-- @vuese:LessonContentCard:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|title|-|`String`|`true`|-|
|description|-|`String`|`true`|-|
|thumbnail|-|`String`|`false`|null|
|kind|-|`String`|`true`|-|
|isLeaf|-|`Boolean`|`true`|-|
|link|-|`Object`|`true`|-|
|numCoachContents|ContentNode.coach_content will be `0` if not a coach content leaf node, or a topic without coach content. It will be a positive integer if a topic with coach content, and `1` if a coach content leaf node.|`Number`|`false`|0|
|message|-|`String`|`false`|-|

<!-- @vuese:LessonContentCard:props:end -->

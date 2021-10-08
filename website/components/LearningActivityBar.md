# LearningActivityBar

## Props

<!-- @vuese:LearningActivityBar:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|resourceTitle|-|`String`|`true`|-|
|learningActivities|An array of one or more learning activities constants|`Array`|`true`|-|
|isLessonContext|Is the bar used in the context of a lesson? There are slight differences in rendering related to the context, e.g. action buttons labels.|`Boolean`|`false`|false|
|isBookmarked|-|`Boolean`|`false`|false|
|allowMarkComplete|Does a resource have the option to be manually marked as complete? Used to determine if a button for this action should be displayed.|`Boolean`|`false`|false|
|contentProgress|The progress of the currently viewed content to determine if and which progress icon should be shown (none/started/complete)|`Number`|`false`|0|
|isCoachContent|A 1/0 Boolean check whether we should show the Coach Content icon to be passed to the CoachContentLabel component|`Number`|`false`|0|
|contentKind|The ContentNodeKinds kind of the content being viewed|`String`|`false`|null|

<!-- @vuese:LearningActivityBar:props:end -->


## Events

<!-- @vuese:LearningActivityBar:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|navigateBack|-|-|
|`actionEvent`|-|-|

<!-- @vuese:LearningActivityBar:events:end -->


## MixIns

<!-- @vuese:LearningActivityBar:mixIns:start -->
|MixIn|
|---|
|KResponsiveWindowMixin|
|commonLearnStrings|
|commonCoreStrings|

<!-- @vuese:LearningActivityBar:mixIns:end -->

# AssessmentWrapper

## Props

<!-- @vuese:AssessmentWrapper:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|id|-|`String`|`true`|-|
|lang|-|`Object`|`false`|-|
|kind|-|`String`|`true`|-|
|files|-|`Array`|`false`|[]|
|channelId|-|`String`|`false`|-|
|available|-|`Boolean`|`false`|false|
|assessmentIds|-|`Array`|`true`|-|
|randomize|-|`Boolean`|`true`|-|
|masteryModel|-|`Object`|`true`|-|
|extraFields|-|`Object`|`false`|{}|
|progress|An explicit record of the current progress through this piece of content.|`Number`|`false`|0|
|userId|An identifier for the user interacting with this content|`String`|`false`|null|
|userFullName|-|`String`|`false`|null|
|timeSpent|-|`Number`|`false`|null|

<!-- @vuese:AssessmentWrapper:props:end -->


## Events

<!-- @vuese:AssessmentWrapper:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|updateProgress|-|-|
|updateContentState|-|-|
|startTracking|-|-|
|stopTracking|-|-|

<!-- @vuese:AssessmentWrapper:events:end -->


## MixIns

<!-- @vuese:AssessmentWrapper:mixIns:start -->
|MixIn|
|---|
|commonCoreStrings|
|responsiveWindowMixin|

<!-- @vuese:AssessmentWrapper:mixIns:end -->

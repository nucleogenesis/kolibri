# RecipientSelector

## Props

<!-- @vuese:RecipientSelector:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|value|Needs to equal [classId] if entire class is selected Otherwise, [groupId_1, groupId_2] for individual Learner Groups|`Array`|`true`|-|
|groups|Array of objects, each with (group) 'id' and 'name'|`Array`|`true`|-|
|classId|For the 'Entire Class' option|`String`|`true`|-|
|disabled|-|`Boolean`|`false`|false|
|initialAdHocLearners|-|`Array`|`false`|new Array()|

<!-- @vuese:RecipientSelector:props:end -->


## Events

<!-- @vuese:RecipientSelector:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|updateLearners|-|-|
|input|-|-|

<!-- @vuese:RecipientSelector:events:end -->


## MixIns

<!-- @vuese:RecipientSelector:mixIns:start -->
|MixIn|
|---|
|coachStringsMixin|

<!-- @vuese:RecipientSelector:mixIns:end -->

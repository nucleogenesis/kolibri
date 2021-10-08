# AssignmentDetailsModal

## Props

<!-- @vuese:AssignmentDetailsModal:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|modalTitleErrorMessage|-|`String`|`false`|null|
|submitErrorMessage|-|`String`|`true`|-|
|initialTitle|-|`String`|`true`|-|
|initialDescription|-|`String`|`false`|null|
|initialSelectedCollectionIds|-|`Array`|`true`|-|
|initialAdHocLearners|-|`Array`|`true`|-|
|classId|-|`String`|`true`|-|
|groups|-|`Array`|`true`|-|
|initialActive|-|`Boolean`|`false`|-|
|disabled|If set to true, all of the forms are disabled|`Boolean`|`false`|false|
|assignmentType|Should be 'quiz', 'lesson', or 'new_lesson'|`String`|`true`|-|

<!-- @vuese:AssignmentDetailsModal:props:end -->


## Events

<!-- @vuese:AssignmentDetailsModal:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|submit|-|-|
|cancel|-|-|

<!-- @vuese:AssignmentDetailsModal:events:end -->


## Slots

<!-- @vuese:AssignmentDetailsModal:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|resourceTable|-|-|

<!-- @vuese:AssignmentDetailsModal:slots:end -->


## MixIns

<!-- @vuese:AssignmentDetailsModal:mixIns:start -->
|MixIn|
|---|
|coachStringsMixin|
|commonCoreStrings|

<!-- @vuese:AssignmentDetailsModal:mixIns:end -->

# IndividualLearnerSelector

## Props

<!-- @vuese:IndividualLearnerSelector:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|isVisible|If true, the main checkbox is checked and the list of learners is shown|`Boolean`|`true`|-|
|selectedGroupIds|Used to disable learner rows if already assigned via learner group|`Array`|`true`|-|
|selectedLearnerIds|List of selected learner IDs (must be .sync'd with parent form)|`Array`|`true`|-|
|disabled|Disables the entire form|`Boolean`|`true`|false|
|targetClassId|Only given when not used in current class context|`String`|`false`|null|

<!-- @vuese:IndividualLearnerSelector:props:end -->


## Events

<!-- @vuese:IndividualLearnerSelector:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|togglevisibility|-|-|

<!-- @vuese:IndividualLearnerSelector:events:end -->


## MixIns

<!-- @vuese:IndividualLearnerSelector:mixIns:start -->
|MixIn|
|---|
|commonCoreStrings|
|commonCoachStrings|

<!-- @vuese:IndividualLearnerSelector:mixIns:end -->

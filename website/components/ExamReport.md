# ExamReport

## Props

<!-- @vuese:ExamReport:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|examAttempts|-|`Array`|`true`|-|
|exam|-|`Object`|`true`|-|
|userName|-|`String`|`true`|-|
|currentInteractionHistory|-|`Array`|`true`|-|
|currentInteraction|-|`Object`|`false`|null|
|selectedInteractionIndex|-|`Number`|`true`|-|
|questionNumber|-|`Number`|`true`|-|
|exercise|-|`Object`|`true`|-|
|itemId|-|`String`|`true`|-|
|completionTimestamp|-|`Date`|`false`|null|
|closed|-|`Boolean`|`true`|-|
|navigateToQuestion|-|`Function`|`true`|-|
|navigateToQuestionAttempt|-|`Function`|`true`|-|
|questions|-|`Array`|`true`|-|
|exerciseContentNodes|-|`Array`|`true`|-|

<!-- @vuese:ExamReport:props:end -->


## MixIns

<!-- @vuese:ExamReport:mixIns:start -->
|MixIn|
|---|
|commonCoreStrings|

<!-- @vuese:ExamReport:mixIns:end -->

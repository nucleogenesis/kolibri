# QuestionListPreview

## Props

<!-- @vuese:QuestionListPreview:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|fixedOrder|If set to true, question buttons will be draggable|`Boolean`|`true`|-|
|readOnly|If set to true, controls will be disabled for fixed-order mode|`Boolean`|`false`|false|
|selectedQuestions|Array of { question_id, exercise_id, title } from Exam.question_sources|`Array`|`true`|-|
|selectedExercises|A Map(id, ContentNode)|`Object`|`true`|-|

<!-- @vuese:QuestionListPreview:props:end -->


## MixIns

<!-- @vuese:QuestionListPreview:mixIns:start -->
|MixIn|
|---|
|coachStringsMixin|

<!-- @vuese:QuestionListPreview:mixIns:end -->

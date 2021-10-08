# CompletionModal

A modal displayed after finishing a learning activity where users can decide to continue to a next activity, stay, or navigate to one of the recommended resources. A customized `KModal` fork (it deviates too much for us to be able to use `KModal` and we don't want to update KDS because this may be the only modal following different patterns)

## Props

<!-- @vuese:CompletionModal:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|isUserLoggedIn|A sign-in prompt is displayed if a user is not logged in for them to be able to earn points for completing the activity.|`Boolean`|`true`|-|
|nextContentNode|If there is a resource following the current resource, "Keep going" section is displayed and a user can navigate to the next resource|`Object`|`false`|null|
|nextContentNodeRoute|vue-router link object A next resource route that needs be provided when `nextContentNode` is provided|`Object`|`false`|null|
|recommendedContentNodes|If there is at least one resource in this array of recommended resources, "You may find helpful" section is displayed and a user can navigate to one of the resources.|`Array`|`false`|null|
|genContentLink|A function that receives `content_node.id` and `content_node.is_leaf` and returns a vue-router link object for the content node used for generating target routes of recommended resources. It needs be provided when `recommendedContentNodes` are provided.|`Function`|`false`|() => null|

<!-- @vuese:CompletionModal:props:end -->


## Events

<!-- @vuese:CompletionModal:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|close|-|-|

<!-- @vuese:CompletionModal:events:end -->


## MixIns

<!-- @vuese:CompletionModal:mixIns:start -->
|MixIn|
|---|
|KResponsiveWindowMixin|
|commonLearnStrings|

<!-- @vuese:CompletionModal:mixIns:end -->

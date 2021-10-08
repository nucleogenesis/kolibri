# FacilityTaskPanelDetails

## Props

<!-- @vuese:FacilityTaskPanelDetails:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|task|-|`Object`|`true`|-|
|statusMsg|-|`String`|`true`|-|
|headingMsg|-|`String`|`true`|-|
|underHeadingMsg|-|`String`|`false`|null|
|underProgressMsg|-|`String`|`false`|null|
|showCircularLoader|-|`Boolean`|`false`|false|
|loaderType|-|`String`|`false`|null|
|buttonSet|-|`String`|`false`|null|

<!-- @vuese:FacilityTaskPanelDetails:props:end -->


## Events

<!-- @vuese:FacilityTaskPanelDetails:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|cancel|-|-|
|clear|-|-|
|retry|-|-|

<!-- @vuese:FacilityTaskPanelDetails:events:end -->


## MixIns

<!-- @vuese:FacilityTaskPanelDetails:mixIns:start -->
|MixIn|
|---|
|commonCoreStrings|
|responsiveWindowMixin|
|commonTaskStrings|

<!-- @vuese:FacilityTaskPanelDetails:mixIns:end -->

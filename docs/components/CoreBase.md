# CoreBase

## Props

<!-- @vuese:CoreBase:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|appBarTitle|-|`String`|`false`|-|
|fullScreen|Prop that determines whether to show nav components and provide margins|`Boolean`|`false`|false|
|hasSidebar|Prop that determines if the page contains an embedded sidebar|`Boolean`|`false`|false|
|marginBottom|reserve space at the bottom for floating widgets|`Number`|`false`|0|
|authorized|AUTHORIZATION SPECIFIC|`Boolean`|`false`|true|
|authorizedRole|-|`String`|`false`|null|
|authorizationErrorHeader|-|`String`|`false`|null|
|authorizationErrorDetails|-|`String`|`false`|null|
|immersivePage|IMMERSIVE-SPECIFIC|`Boolean`|`false`|false|
|immersivePageIcon|generally a 'back' or 'close' icon|`String`|`false`|close|
|immersivePageRoute|link to where the 'back' button should go|`Object`|`false`|null|
|immersivePagePrimary|determines the color, primary being the classic kolibri appbar color|`Boolean`|`false`|-|
|toolbarTitle|-|`String`|`false`|-|
|pageTitle|Alternative to using metaInfo in a top level component to set the title of the HTML Document|`String`|`false`|-|
|showSubNav|If true, will render the component in the "sub-nav" slot and add 48px to AppBody's top offset.|`Boolean`|`false`|false|
|debug|-|`Boolean`|`false`|false|
|maxMainWidth|-|`Number`|`false`|1000|
|showDemoBanner|-|`Boolean`|`false`|false|

<!-- @vuese:CoreBase:props:end -->


## Events

<!-- @vuese:CoreBase:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|navIconClick|-|-|

<!-- @vuese:CoreBase:events:end -->


## Slots

<!-- @vuese:CoreBase:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|default|-|-|

<!-- @vuese:CoreBase:slots:end -->


## MixIns

<!-- @vuese:CoreBase:mixIns:start -->
|MixIn|
|---|
|responsiveWindowMixin|
|commonCoreStrings|

<!-- @vuese:CoreBase:mixIns:end -->

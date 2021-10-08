# UserTable

## Props

<!-- @vuese:UserTable:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|users|-|`Array`|`true`|-|
|emptyMessage|-|`String`|`false`|null|
|selectable|-|`Boolean`|`false`|false|
|value|used for optional checkboxes|`Array`|`false`|null|
|isCoach|-|`Boolean`|`false`|false|
|infoDescriptor|-|`String`|`false`|-|
|showDemographicInfo|If true, shows ID number, gender, and birth year columns|`Boolean`|`false`|false|
|disabled|-|`Boolean`|`false`|false|
|selectedStyle|-|`String`|`false`|-|

<!-- @vuese:UserTable:props:end -->


## Slots

<!-- @vuese:UserTable:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|info|-|-|
|action|-|-|

<!-- @vuese:UserTable:slots:end -->


## MixIns

<!-- @vuese:UserTable:mixIns:start -->
|MixIn|
|---|
|commonCoreStrings|

<!-- @vuese:UserTable:mixIns:end -->

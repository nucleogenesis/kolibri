# BaseCard

Common layout for a lesson, quiz and resource cards. Provides `topLeft` and `topRight` slots for top left and top right areas above the title. Provides `progress` slot with default content that can be overriden.

## Props

<!-- @vuese:BaseCard:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|to|vue-router link object|`Object`|`true`|-|
|title|-|`String`|`true`|-|
|collectionTitle|-|`String`|`false`|-|
|completedLabel|Provide when using the default content of `progress` slot.|`String`|`false`|-|
|inProgressLabel|Provide when using the default content of `progress` slot.|`String`|`false`|-|

<!-- @vuese:BaseCard:props:end -->


## Slots

<!-- @vuese:BaseCard:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|topLeft|-|-|
|topRight|-|-|
|progress|-|-|

<!-- @vuese:BaseCard:slots:end -->

# SelectAddressForm

## Props

<!-- @vuese:SelectAddressForm:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|discoverySpinnerTime|-|`Number`|`false`|2500|
|filterByFacilityId|Facility filter only needed on SyncFacilityModalGroup|`String`|`false`|null|
|filterByChannelId|Channel filter only needed on ManageContentPage/SelectNetworkAddressModal|`String`|`false`|null|
|hideSavedAddresses|Hides "New address" button and other saved locations|`Boolean`|`false`|false|
|selectedId|If an ID is provided, that address's radio button will be automatically selected|`String`|`false`|null|
|formDisabled|Disables all the form controls|`Boolean`|`false`|false|
|filterLODAvailable|-|`Boolean`|`false`|false|

<!-- @vuese:SelectAddressForm:props:end -->


## Events

<!-- @vuese:SelectAddressForm:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|submit|-|-|
|cancel|-|-|
|click_add_address|-|-|

<!-- @vuese:SelectAddressForm:events:end -->


## Slots

<!-- @vuese:SelectAddressForm:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|underbuttons|-|-|

<!-- @vuese:SelectAddressForm:slots:end -->


## MixIns

<!-- @vuese:SelectAddressForm:mixIns:start -->
|MixIn|
|---|
|commonCoreStrings|
|commonSyncElements|

<!-- @vuese:SelectAddressForm:mixIns:end -->


nts|

<!-- @vuese:SelectAddressForm:mixIns:end -->

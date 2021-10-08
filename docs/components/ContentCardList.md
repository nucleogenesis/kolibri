# ContentCardList

## Props

<!-- @vuese:ContentCardList:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|showSelectAll|-|`Boolean`|`false`|false|
|viewMoreButtonState|-|`String`|`true`|-|
|selectAllChecked|-|`Boolean`|`false`|false|
|selectAllIndeterminate|-|`Boolean`|`false`|false|
|contentList|-|`Array`|`true`|-|
|contentIsChecked|Function that returns true if content item checkbox is checked|`Function`|`true`|-|
|contentIsIndeterminate|Function that returns true if content item checkbox is indeterminate|`Function`|`false`|() => false|
|contentHasCheckbox|Function that returns true if content item needs a checkbox|`Function`|`true`|-|
|contentCardMessage|Function that returns a string that appears in the corner of the card|`Function`|`true`|-|
|contentCardLink|Function that returns a route object to which the card navigates|`Function`|`true`|-|

<!-- @vuese:ContentCardList:props:end -->


## Events

<!-- @vuese:ContentCardList:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|change_content_card|-|-|
|changeselectall|-|-|
|moreresults|-|-|

<!-- @vuese:ContentCardList:events:end -->


## MixIns

<!-- @vuese:ContentCardList:mixIns:start -->
|MixIn|
|---|
|commonCoreStrings|

<!-- @vuese:ContentCardList:mixIns:end -->

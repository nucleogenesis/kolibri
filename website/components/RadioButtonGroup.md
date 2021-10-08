# RadioButtonGroup

## Props

<!-- @vuese:RadioButtonGroup:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|items|-|`Array`|`true`|-|
|currentValue|The value of the currently selected radio button Must be .sync-ed with parent|`String` /  `Number` /  `Boolean`|`true`|-|
|itemValue|A function that takes an item and returns something to be used as the value|`Function`|`true`|-|
|itemLabel|A function that takes an item and returns a string to be used as the label|`Function`|`true`|-|
|itemDescription|-|`Function`|`false`|() => ''|

<!-- @vuese:RadioButtonGroup:props:end -->


## Slots

<!-- @vuese:RadioButtonGroup:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|underbutton|-|-|

<!-- @vuese:RadioButtonGroup:slots:end -->

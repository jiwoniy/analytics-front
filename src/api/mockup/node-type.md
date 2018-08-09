# Meta Node's schema

- id
> unique meta id
- name
> meta node name
- desc
> meta node description
- [properties](#properties)
> properties that a node may have

## properties

string, boolean, number, null, undefined, object(Array, Date, Object)

- id(?)
- name
- require
- default
> default value
- type
```
String
Number
Boolean
Array
Date
```

- [UI Type](https://semantic-ui.com/modules/checkbox.html)

1. string
> ex) code snippet
```
- input(text)
- textarea
- radio
- dropdown(single/multiple)
```
2. boolean
```
- checkbox
- slider
- toggle switch
```
3. number
```
- input(number)
```
4. array
```
- dropdown(single/multiple)
```
5. date
```
- dropdown
- calendar
```
- validation
- postprocess
- paramter_key
- language
```
- Sql
- Python
```


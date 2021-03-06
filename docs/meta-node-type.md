# Meta Node's schema

- id
  - unique meta node id
- name
  - meta node name
- desc  
  - meta node description

- [properties](#properties)
  - properties that a node may have

## properties

- parameter_key
  - parameter key
- name
  - property name
- type
  - property value [json type](https://www.w3schools.com/js/js_json_datatypes.asp)
  - This [Link](https://www.w3schools.com/js/js_json_stringify.asp) should be used with caution when communicating with json.
  ```
  string
  number
  boolean
  object
  array
  null
  ```
- ui type
  ```
  dropdown
  multi_dropdown
  switch-toggle
  radio
  checkbox
  selector
  input
  textarea
  ```
- require
  - required
- value
  - inital value
- options
  - if ui type are dropdonw, multi_dropdown, radio, selector then this should be define
- code_language
  - sql or python

- postprocess(?)
- validation(?)


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

Folder Structure
=============

```
dtonic/
  build/
  config/
  dist/
  node_modules/
  static/
  docs/
  package.json
  README.md
  src/
    App.vue
    main.js
    assets/
    components/
    router/
    store/
    plugins/
    api/
    config/
    directives/
    styles/
    utils/
    helper/
```

Most structures were constructed by [vue templates](https://vuejs.org/v2/guide/index.html). You have to read the official document to understand it.

* [build](https://vuejs.org/v2/guide/installation.html#ad)

* static
  - The path of the file(image etc..)

* [components](https://vuejs.org/v2/guide/index.html#Composing-with-Components)
  - common :  Can be used anywhere component
  - graph : Modules to create nodes and connect nodes
  - panel: Pages made up of multiple components
  - ui : Components created for specific UI functions
  - CodeEditor : editor for code(grammar-highlighted)
  - CreateProject : project create component
  - CreateWorksheet : worksheet create component
  - Home : Main page(component)
  - Menu : menu component
  - NodeManger : CRUD node property component
  - WorksheetManager: CRUD worksheet property component

* api
  - For restful communication with the server

* config
  - About app's setting

* [directive](https://vuejs.org/v2/guide/custom-directive.html)
  - define app's directive

* [events](https://vuejs.org/v2/guide/components-custom-events.html)
  - For communication between components

* plugins
  - 3'rd party tools

* [router](https://router.vuejs.org/)
  - App's router

* [store](https://vuex.vuejs.org/)

* styles
  - App's styles

* utils
  - App's utils




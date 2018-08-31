Component
=============

## hierarchy
App(root component)
  - Home
    - Top
    - Project
      - Modal
      - Watch pipeline
      - Main
        - Left
          - Accordion
        - Work
          - Drop Comp
            - Palete(Svg palete)
        - Right
          - Worksheet Manager
          - Node Manager
        - Foot

## component description
1. App
    * desc
      > root component for app
    * features
      > routing

2. Home
    * desc
      > entry component for this app
    * features
      - container for top, project panel
      - get projects, pipeline meta, meta nodes

3. Top
    * desc
      > top area for this app
    * feature
      > navigation project

4.  Project
    * desc
      > container for main component
    * features
      - show/hide modal
      - show/hide watch pipeline modal
      - parent of main panel

5. Main
    * desc
      > container of left, work, right, foot panel
    * features
      - panel resize/toggle
      - listen pipeline edit 

6. Menu
    * desc
      > project list component
    * features
      - choice project
      - create project

7. Working
    * desc
      > working container component for this app
    * features
      - dropable, svg

8. Palete
    * desc
      > core component for desing pipeline
    * features
      - draw/delete/add/remove node, links
      - update node information
      - lock/unlock/save pipeline

9. NodeManager
    * desc
      > container of node properties
    * features
      - set properties ui
      - filter properties
      - pass event

10. WorksheetManager
    * desc
      > container of worksheets properties
    *  features
      - set properties ui
      - filter properties
      - pass event

11. CreateProject/CreateWorksheet
    * desc
      > component of create project/ create worksheet
    * features
      - create projecdt/worksheet

12. TreeItems/TreeItems
    * desc
      > to present the hierarchy
    * features
      - display tree item
    
13. HAccordion
    * desc
      > to present horizantal accordion

14. ListView
    * desc
      > to present list view

15. DragItem
    * desc
      > make component draggable

16. Drop
    * desc
      > make component dropable

17. Modal
    * desc
      > to present modal
    * features
      - make modal
      - should received props component
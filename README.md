## Magento 2 Product QuickView Module
Magento extension Quick View brings a convenient experience to the shoppers: for any item they pay attention to, only one click is needed to reach the item info. There will be no more loading page for product detail but a pop-up window with Add-to-Cart button appears in no time.

### Main Features:
* Ajax-based popup window (no iframe)
* Support multiple Websites, Store Views Configuration
* View product information in the popup window anywhere
* Ajax-add-to-cart in Quick View window
* Allow to submit reviews for product within Quick View window
* Support multiple languages
* Allow quick view with all product types: Simple Products, Configurable Products, Download Products, Bundle Products, Virtual Products, Grouped Products
* Allow previous/next product navigation inside Quick View
* Allow to set the type and speed of transition (Fade, Elastic, None)
* Allow to set initial width/height of Quick View popup window when Quick View opens.
* Allow to show/hide Quick View title in the popup window
* Allow to show/hide current state of Quick View
* Allow to show/hide the Go to product button
* Allow to show/hide Product Detail / Product review tab
* Allow to customize the label of Quick View button
* Allow to add your own additional CSS class
* Automatically apply the style of your chosen theme, so it helps to avoid potential conflict with any 3rd-party theme.
* Fully Responsive

### Installation Guide
````
composer require scriptua/magento2-quickview
bin/magento module:enable Script_Base
bin/magento module:enable Script_QuickView
bin/magento setup:upgrade
````

### Frontend view
###### Button in grid catalog product
![Button in grid catalog product](http://hryvinskyi.com/images/hover_element.png)

###### Open popup product
![Open popup product](http://hryvinskyi.com/images/popup.jpg)

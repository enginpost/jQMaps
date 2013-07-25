jQMaps
====================

A plugin for jQuery useful in creating a Google Map embed managing
the configuration of map markers and custom marker pins in XML.

-------------------
WHY I WANTED TO CREATE jQMAPS

While the Google Maps API is powerful and embedding it is not too difficult, I wanted a quicker way to setup interactive markers and affiliate a marker with a lot of custom data so I could build non-map overlays more complex than a simple bubble.

XML seemed to be a good way to setup both the map configuration as well as the marker data. But when it is time to respond to marker click events, I wanted a simple way to get access to data from the XML associated with that marker. The jQMaps plugin lets you specify a callback function and converts simple attributeless node-ony XML data into JSON attached to the marker as it is passed to the callback. This makes it incredibly simple to test and use data values associated with the marker and create custom DOM animations and presentations of data above or outside of the Google Map.

In addition to embed configuration, marker data and callback management for markers, jQMaps also lets you pre-configure and reference marker art. The XML file can pre-configure an innumerable set of marker styles and looks and you can associated those pre-configured marker types. In addition to that each marker can also specify custom marker art or make use of the google charts dynamic number marker (which allows you to set a number of attributes including a numeric value within the marker, and Google Charts creates that for you).

So far I have tested the plugin and it works under all recent copies of FireFox, Chrome, Safari and IE 6 through 10.

-------------------
CONTENTS

- jQMaps.js: The plugin where all of the action happens.
- Example folder: This is an example which demonstrates all of the current features.
  - index.html: Sample HTML file showing how to use jQMaps.
  - my-map.xml: Demonstrates the expected XML jQMaps needs to create your Google Map plugin
  - *.PNG: The PNG files demonstrate both the ability to setup preconfigured marker pinTypes, custom markers as well as dynamic markers.

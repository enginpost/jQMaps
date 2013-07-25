jQMaps
====================

A plugin for jQuery useful in creating a Google Map embed managing
the configuration of map markers and custom marker pins in XML.

-------------------
##Why another jQuery Google Maps API plugin

While the *Google Maps API* is powerful and embedding it is not too difficult, I wanted a quicker way to setup interactive markers and affiliate a marker with a lot of custom data so I could build non-map overlays more complex than a simple bubble.

XML seemed to be a good way to setup both the map configuration as well as the marker data. But when it is time to respond to marker click events, I wanted a simple way to get access to data from the XML associated with that marker. The jQMaps plugin lets you specify a callback function and converts simple attributeless node-ony XML data into JSON attached to the marker as it is passed to the callback. This makes it incredibly simple to test and use data values associated with the marker and create custom DOM animations and presentations of data above or outside of the Google Map.

In addition to embed configuration, marker data and callback management for markers, jQMaps also lets you pre-configure and reference marker art. The XML file can pre-configure an innumerable set of marker styles and looks and you can associated those pre-configured marker types. In addition to that each marker can also specify custom marker art or make use of the google charts dynamic number marker (which allows you to set a number of attributes including a numeric value within the marker, and Google Charts creates that for you).

So far I have tested the plugin and it works under all recent copies of FireFox, Chrome, Safari and IE 6 through 10.

-------------------
##Contents

- [jQMaps.js](jQMaps.js): The plugin where all of the action happens.
- Example folder: This is an example which demonstrates all of the current features.
  - index.html: Sample HTML file showing how to use jQMaps.
  - my-map.xml: Demonstrates the expected XML jQMaps needs to create your Google Map plugin
  - *.PNG: The PNG files demonstrate both the ability to setup preconfigured marker pinTypes, custom markers as well as dynamic markers.

-------------------
##Getting started
To quickly get started with jQMaps you have three things to do:

###Add jQuery, Google Maps API and jQMaps scripts to the head of your document
```
<html>
  <head>
    <meta charset=utf-8>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <title>My sample map</title>
    <script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry"></script>
    <script type="text/javascript" src="../jqmaps.js"></script>
  </head>
```

###Edit your jQMaps.xml file to setup your markers and marker data
```
<jqmap>
  <config>
    <map zoom='fit' center_lat='40.348637' center_lng='-74.658365' width='1200' height='550' />
    <pins animate='true'>
      <pin name='office' icon='office.png' shadow='' />
    </pins>
  </config>
  <markers>
    <marker lat='40.349937' lng='-74.663156' type='office'>
      <marker_data>
        <title><![CDATA[Office of Communications]]></title>
        <description><![CDATA[22 Chambers Street<br/>Princeton, NJ 08540]]></description>
      </marker_data>
    </marker>
  </marker>
</jqmap>
```
You can create any XML nodes you need under <marker_data> but the nodes cannot have attributes. This simple format makes it easy for jQMaps to later convert that XML to JSON and attach it to the marker click event. And be sure that your pre-configured marker graphics exist.

###Add a DIV to the HTML on the page and use jQMaps to build the Google Map embed using your XML file.
```
<div id="myMap"></div>
<div id="mapMessage">
  <h2 id="title"></h2>
  <p id="description"></p>
</div>
<script type="text/javascript">
  jQuery(document).ready(function(){
    jQuery('#myMap').buildGoogleMap('my-map.xml', marker_onClick );
  });
  function marker_onClick(){
    jQuery('#mapMessage #title').html(this.marker_data.title);
    jQuery('#mapMessage #description').html(this.marker_data.description);
  }
</script>
```
In the above example, A google map would be loaded with a single marker and when the visitor clicks the marker the local function "marker_onClick" would be called and the marker_data attached to the marker would update the map message area of the screen using jQuery.

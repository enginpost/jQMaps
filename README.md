jQMaps
====================

A plugin for jQuery useful in creating Google Map embeds by managing
the configuration of map markers and custom marker pins in XML.

-------------------
##Why another jQuery Google Maps API plugin

Here was my use-case:

- [x] A quick self-inclusive portable way to configure a google map embed (XML makes that easy).
- [x] To create a set of reusable pre-configured marker pins that I could assign to the markers on my map (XML).
- [x] To have completely custom marker-by-marker pin art (XML).
- [x] A simple process for connecting all of my pins to a single javascript function (jQuery helps here).
- [x] To make use of the XML data to extend the data passed to a marker click event so I could do more dramatic things than simply show some HTML in a Google Maps Embed info bubble. 

And I have other goals:

- [ ] To make the callback function optional, for a non-interactive map.
- [ ] To allow markers to specify their address as a traditional address and not latitude and longitude.
- [ ] To optionally print out latitude and longitude info to the browser console if the marker initially specified a traditional address (so site authors can update their markers with correct lat and long info rather than take the time to have jQMaps look it up on each page render).
- [ ] To optionally add "distance from map center" information to a marker's &lt;marker_data&gt; for the click event.
- [ ] To add attribute to JSON conversion for &lt;marker_data&gt; in the XML (right now marker data is node-only).

So far I have tested the plugin and it works under all recent copies of FireFox, Chrome, Safari and IE 6 through 10.

-------------------
##Contents

- [jQMaps.js](jQMaps.js): The plugin where all of the action happens.
- Example folder: This is an example which demonstrates all of the current features.
  - [index.html](example/index.html): Sample HTML file showing how to use jQMaps.
  - [my-map.xml](example/my-map.xml): Demonstrates the expected XML jQMaps needs to create your Google Map plugin
  - *.PNG: The PNG files demonstrate both the ability to setup preconfigured marker pinTypes, custom markers as well as dynamic markers.

*The example references both JQuery and the Google Maps API through their respective CDNs.*

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
You can create any XML nodes you need under &lt;marker_data&gt; but the nodes cannot have attributes. This simple format makes it easy for jQMaps to later convert that XML to JSON and attach it to the marker click event. Save this file as "my-map.xml". And be sure that your pre-configured marker graphics exist.

###Add a DIV to the HTML on the page and use jQMaps to build the Google Map embed using your XML file.
```
<body>
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
</body>
```
In the above example, A google map would be loaded with a single marker and when the visitor clicks the marker the local function "marker_onClick" would be called and the marker_data attached to the marker would update the map message area of the screen using jQuery.

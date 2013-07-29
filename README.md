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

- [x] To make marker event functions optional, for a non-interactive map. (added on: 7/27/2013)
- [x] To support a number of marker events: click, mouseover, mouseout. (added on: 7/28/2013)
- [x] To add a callback function that fires once the map is painted to the screen. (added on: 7/28/2013)
- [x] To allow markers to specify their address as a traditional address and not latitude and longitude. (added on: 7/27/2013)
- [x] To optionally print out latitude and longitude info to the browser console if the marker initially specified a traditional address (so site authors can update their markers with correct lat and long info rather than take the time to have jQMaps look it up on each page render). (added on: 7/27/2013)
- [ ] To optionally add "distance from map center" information to a marker's &lt;marker_data&gt; for the click event.
- [ ] To add attribute to JSON conversion for &lt;marker_data&gt; in the XML (right now marker data is node-only).

So far I have tested the plugin and it works under all recent copies of FireFox, Chrome, Safari and IE 6 through 10.

-------------------
##Example contents

- jQMaps.js: The plugin where all of the action happens.
- Example folder: This is an example which demonstrates all of the current features.
  - Simple.html: Sample HTML file showing a few simple features for how to get started.
  - Complex.html: Sample HTML file showing a more complex array of features for jQMaps.
  - my-map.xml: Demonstrates the expected XML jQMaps needs to create your Google Map plugin.
  - *.PNG: The PNG files demonstrate both the ability to setup preconfigured marker pinTypes, custom markers as well as dynamic markers.

*The example references both JQuery and the Google Maps API through their respective CDNs.*

-------------------
##Getting started
To quickly get started with jQMaps you have three things to do:

####Add jQuery, Google Maps API and jQMaps scripts to the head of your document
```HTML
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
*Make note of the use of remote resources. In some cases, you may need to be on a Web server to test your code.*

####Edit your jQMaps XML file to setup your markers and marker data
```XML
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
You can create any XML nodes you need under &lt;marker_data&gt; but the nodes cannot have attributes. This simple format makes it easy for jQMaps to later convert that XML to JSON and attach it to the marker click event. Save this file as "my-map.xml". And be sure that your pre-configured marker graphics exist. Also note that the &lt;marker_data&gt; child nodes are all wrapped in CDATA comments. This ensures that any included HTML doesn't break your XML file.

####Add a DIV to the HTML on the page and use jQMaps to build the Google Map embed using your XML file.
```HTML
<body>
  <div id="myMap"></div>
  <div id="mapMessage">
    <h2 id="title"></h2>
    <p id="description"></p>
  </div>
  <script type="text/javascript">
    jQuery(document).ready(function(){
      jQuery('#myMap').buildGoogleMap({'map':'my-map.xml','markerDebug': false, 'click': marker_onClick } );
    });
    function marker_onClick(){
      jQuery('#mapMessage #title').html(this.marker_data.title);
      jQuery('#mapMessage #description').html(this.marker_data.description);
    }
  </script>
</body>
```
In the above example a google map would be loaded with a single marker and when the visitor clicks the marker the local function "marker_onClick" would be called and the marker_data attached to the marker would update the map message area of the screen using jQuery. You can see here how your marker_data child nodes are converted to JSON and attached to your marker in the click event (the marker you clicked would be refered to as "this" in the event context).

###Other features:Map and marker events

####Marker events

At the moment there are a total of three mouse events that can be associated with a marker:

- **mouse click**: This event fires when a mouse clicks on a marker.
- **mouse over**: This event fires when a mouse rolls over a marker.
- **mouse out**: This event fires when a mouse rolls out from being over a marker.

You write functions to handle those events and associate them by passing them into the "buildGoogleMap" function
```Javascript
jQuery('#myMap').buildGoogleMap({'map':'my-map.xml','markerDebug': false, 'click': marker_onClick, 'mouseover': marker_onMouseOver, 'mouseout': marker_onMouseOut } );
```

####Map events

In some cases you may want to know when a map is painted onto the screen. To achieve this I am waiting for the first time all of the map tiles paint into the display. Although they continue to repaint each time the zoom level changes on a Google Map, I am only firing the event the first time.

To hook into this event you need to add a function as the second optional parameter to the "buildGoogleMap" function:
```Javascript
jQuery('#myMap').buildGoogleMap({'map':'my-map.xml'}, function(thisMap){ 
  alert("The map is now loaded and visible!");
});
```

###Other features: Marker options

####Marker location

There are two ways to specify the location of your marker:

#####Marker location by latitude and longitude

Using google maps and a number of other sources you can determine the latitude and longitude for a marker you want to place on a map. 
```XML
<marker lat='40.346282' lng='-74.653108' ... >
```
Adding 'lat' and 'lng' attributes with their values lets jQMaps pot your pin by that location.

#####Marker location by fuzzy address

You can also use a specific (i.e. "1600 Pennsylvania Ave, Washington, D.C. 20006") or general ("Japan") address and jQMaps will make use of Google Maps geocoder to find the latitude and longitude of that address.
```XML
<marker address='Thérain, france' ... >
```
Geocoder is an ansynchonous service, so while it makes it easy to plot fuzzy addresses it can slow down the loading of your map. This is where you set the second parameter of the "BuildGoogleMap" function, "markerDebug" to true.
```Javascript
jQuery('#myMap').buildGoogleMap({'map':'my-map.xml','markerDebug': true, 'click': marker_onClick } );
```
The second parameters tells jQMaps to attempt to write all of your marker address info out in latitude and longitude to your developer console (be sure to turn this off when you go live). This way you can copy the LatLong info into your marker and get rid of the address attribute which should speed up the map load time.

####Marker pin look

jQMaps gives you three ways of setting up the look of your marker:

#####Pre-configured markers

Pre-configured markers are the marker types your setup in your jQMaps XML. The idea here might be that you map is highlighting a number of types of locations. So you need to setup different types of marker art and associated those marker types with your list of markers.

Example marker type setup in jQMaps XML:

```XML
<jqmap>
  <config>
    <map zoom='fit' center_lat='40.348637' center_lng='-74.658365' width='1200' height='550' />
    <pins animate='true'>
      <pin name='office' icon='office.png' shadow='' />
      <pin name='school' icon='school.png' shadow='' />
      <pin name='sports' icon='sports.png' shadow='' />
    </pins>
  </config>
  <markers>...</markers>
</jqmap>
```
The &lt;pins&gt; nodes setup your marker types. First, you can set the pins to animate on click by setting animate="true". Then you list your individual pins. The name attribute is the type of marker you can apply to your markers list items later. The icon is the pin art, and you can optionally specify the art for a pin shadow. This gets turned into you custom marker art by jQMaps and the Google Maps API.

Now you need to apply these marker types to a marker:
```XML
<markers>
  <marker lat='40.349937' lng='-74.663156' type='office'>
    <marker_data>
      <title><![CDATA[Office of Communications]]></title>
      <description>
        <![CDATA[
        22 Chambers Street<br/>
        Princeton, NJ 08540
        ]]>
      </description>
    </marker_data>
  </marker>
</markers>
```
In the &lt;markers&gt; child nodes you create a new &lt;marker&gt; node and set it's "type" attribute to an above pin "name" which tells jQMaps to use that art for this marker.

#####Numeric markers

Numeric markers are creates by the Google Charts API. In this case the syntax for setting up a Numeric marker changes.
```XML
<marker lat='40.346282' lng='-74.653108' type='number' icon='.9|0|FA7F00|11|b|180'>
```
Setting the attribute "type" to "number" you are telling jQMaps to use the charts dynamic pin art rendering. The "icon" attribute needs to contain a specific list of pipe-delimited values to set the look and value of the numeric marker:

```
<scale_factor>|<rotation_deg>|<fill_color>|<font_size>|<font_style>|<text_line_1>|...|<text_line_5>
```
The value of the marker is not constrained to being a numeric value. You can read more about the [chart dynamic icons](https://developers.google.com/chart/image/docs/gallery/dynamic_icons).

#####Custom markers

And custom markers let you specify specific pin graphics on a marker-by-marker basis.

```XML
<marker lat='40.349937' lng='-74.663156' type='custom' icon='custom.png' shadow=''>
```
*Make note that the shadow attribute is always optional.*

###Other features: Map style

The final two optional parameters of the "buildGoogleMap" function allow you to create a custom aesthetic look for the embedded Google map. The two steps of creating and setting up your custom map look are:

- Google styled maps wizard
[The Google Map Style Wizard](http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html)

First, visit the google maps wizard (which takes a while to load) and learn how to fiddle with different maps layer looks. Once you have a look you prefer, click the "Show JSON" button under Map Styles in the right panel and copy that into a variable in your Web page along with a variable to hold the name of your map style.
```Javascript
  var myMapStyle = [ { "featureType": "landscape", "stylers": [ { "visibility": "on" }, { "weight": 0.1 }, { "saturation": 200 }, { "hue": "#ffaa00" } ] },{ "featureType": "water", "stylers": [ { "hue": "#00bbff" }, { "lightness": 30 }, { "gamma": 0.6 } ] } ];
  var styleName = "Planet Princeton";
```

- Pass the optional Style and style name parameters to jQMaps

Now that you have your style setup, pass it to the "buildGoogleMaps" function:
```Javascript
jQuery('#myMap').buildGoogleMap({'map':'my-map.xml','markerDebug': true, 'callbackFunction': marker_onClick, 'mapStyle': myMapStyle, 'styleName': styleName } );
```

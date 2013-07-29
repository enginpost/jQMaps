(function ( $ ) {

  var mapID;
  var thisMap;
  var mapStyle;
  var mapZoomFit = false;
  var animatePins = false;
  var mapBounds = new google.maps.LatLngBounds ();
  var debugPins = false;
  var pinCount = 0;
  var tempMarkers = [];
  var clickFunction;
  var mouseoverFunction;
  var mouseoutFunction;
  var readyCallBackFunction;
  var animationMarker;
  var animationTimeout = null;
  var pinTypes = new Array();

  jQuery.fn.buildGoogleMap = function( builderSettings, thisReadyCallBackFunction ){
    // builderSettings properties: map - XML file, markerDebug - Boolean, click - function name,
    //                             mouseover = function name, mouseout = function name,
    //                             mapStyle - JSON config for style, styleName - string containing style name
    if( typeof thisReadyCallBackFunction != 'undefined' ) readyCallBackFunction = thisReadyCallBackFunction;
    if( typeof builderSettings.markerDebug != 'undefined') debugPins = builderSettings.markerDebug;
    if( typeof builderSettings.mapStyle != 'undefined' ){
      if( typeof builderSettings.styleName != 'undefined' ){
        mapStyle = new google.maps.StyledMapType( builderSettings.mapStyle, {name: builderSettings.styleName });
      }else{
        mapStyle = new google.maps.StyledMapType( builderSettings.mapStyle, {name: "World Map"});
      }

    }
    if( typeof builderSettings.click != 'undefined' ){
      clickFunction = builderSettings.click;
    }
    if( typeof builderSettings.mouseover != 'undefined' ){
      mouseoverFunction = builderSettings.mouseover;
    }
    if( typeof builderSettings.mouseout != 'undefined' ){
      mouseoutFunction = builderSettings.mouseout;
    }
    var _this = this;
    mapID = jQuery(this).attr('id');

    jQuery.ajax({
      type: 'GET',
      url: builderSettings.map, // your xml file
      dataType: (navigator.appName == 'Microsoft Internet Explorer') ? "text" : "xml", // text for IE, xml for the rest
      success: function(data) {
          if (navigator.appName == 'Microsoft Internet Explorer') {
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.loadXML(data);
            data = xmlDoc;
          }
          data = removeWhitespace( data );
          setupPinTypes( jQuery( data ).find( 'jqmap config pins' ) );
          thisMap = setupMap( _this, data );
          //google.maps.event.addListenerOnce( thisMap, 'idle', mapFullyLoaded );
          google.maps.event.addListenerOnce(thisMap, 'tilesloaded', mapFullyLoaded );
          if( typeof mapStyle != 'undefined' ){
            thisMap.mapTypes.set('map_style',mapStyle);
            thisMap.setMapTypeId('map_style');
          }
          addPins( jQuery( data ).find( 'jqmap markers' ) );
          if( mapZoomFit ) thisMap.fitBounds( mapBounds );
      }, // end success
      error: function(a, b, c) {
        alert('error'); // this is where the errors happen, 'b' and 'c' are typically the only ones with values
      } // end error
    }); // end .ajax

    function setupMap( thisDiv, thisData){
      jQuery(thisDiv).css({
        'width':  jQuery(thisData).find('jqmap config map').attr('width'),
        'height': jQuery(thisData).find('jqmap config map').attr('height'),
        'border': '1px solid #000'
      });
      var mapCenter = new google.maps.LatLng( jQuery(thisData).find('jqmap config map').attr('center_lat'), jQuery(thisData).find('jqmap config map').attr('center_lng') );
      var mapSettings = {
        center: mapCenter,
        draggable:true,
        mapTypeControl: true,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU, mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']},
        navigationControl: true,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      if( jQuery(thisData).find('jqmap config map').attr('zoom') != 'fit'  ){
        mapSettings['zoom'] = parseInt(jQuery(thisData).find('jqmap config map').attr('zoom'));
      }else{
        mapZoomFit = true;
      }
      return new google.maps.Map(document.getElementById(jQuery(thisDiv).attr('id')), mapSettings);
    }

    function mapZoom( thisData ){
      var byValues = false;
      if( jQuery(thisData).find('jqmap config map').attr('zoom') == 'fit' ){
          byValues = true;
      }
      return byValues;
    }

    function setupPinTypes( thesePinTypes ){
      _pins = pinTypes;
      animatePins = ( jQuery( thesePinTypes ).attr('animate') == 'true' ) ? true : false;
      jQuery( thesePinTypes ).find( 'pin' ).each( function(i){
        _pins[jQuery(this).attr('name')] = {
          'icon': jQuery(this).attr('icon'),
          'shadow': jQuery(this).attr('shadow')
        };
      });
    }

    function addPins( thesePins ){
      var geocoder = new google.maps.Geocoder();
      pinCount = jQuery( thesePins ).find( 'marker' ).length;
      jQuery( thesePins ).find( 'marker' ).each( function( i ){
        var thisPin = this;
        var address = jQuery( thisPin ).attr( 'address' );
        if( typeof address != 'undefined' && address !== false){
          geocoder.geocode( { 'address': address }, function( result, status ) {
            if ( status == google.maps.GeocoderStatus.OK ){
              jQuery( thisPin ).attr('lat', result[0].geometry.location.jb);
              jQuery( thisPin ).attr('lng', result[0].geometry.location.kb);
              buildPin( thisPin );
            }
          });
        }else{
          buildPin( thisPin );
        }
      });
    }

    function buildPin( currentPin ){
      var thisMarker = new google.maps.LatLng( jQuery( currentPin ).attr( 'lat' ), jQuery( currentPin ).attr( 'lng' ) );
      mapBounds.extend( thisMarker );
      var thisPin;
      switch( jQuery( currentPin ).attr('type') ){
        case "custom" :
          thisPin = {'icon': jQuery( currentPin ).attr('icon'), 'shadow': jQuery( currentPin ).attr('shadow') };
          break;
        case "number" :
          // https://developers.google.com/chart/image/docs/gallery/dynamic_icons
          // <scale_factor>|<rotation_deg>|<fill_color>|<font_size>|<font_style>|<text_line_1>|...|<text_line_5>
          thisPin = {
            'icon': 'http://chart.apis.google.com/chart?chst=d_map_spin&chld=' + jQuery( currentPin ).attr('icon'),
            'shadow': '' };
          break;
        default:
          thisPin = pinTypes[ jQuery( currentPin ).attr( 'type' ) ];
          break;
      }
      var markerOptions = {
        position: thisMarker,
        map: thisMap,
        optimized: false,
        draggable:false,
        icon: thisPin.icon,
        shadow: thisPin.shadow
      };
      var pinTitle = jQuery( currentPin ).attr( 'title' );
      if( typeof pinTitle != 'undefined' || pinTitle != "") markerOptions['title'] = pinTitle;
      var markerPin = new google.maps.Marker( markerOptions );
      markerPin.marker_data = convertXMLtoJSON(jQuery( currentPin ).find( 'marker_data' ).get(0));
      if( typeof clickFunction != 'undefined' ){
        google.maps.event.addListener(markerPin, 'click', clickFunction);
      }
      if( typeof mouseoverFunction != 'undefined' ){
        google.maps.event.addListener(markerPin, 'mouseover', mouseoverFunction);
      }
      if( typeof mouseoutFunction != 'undefined' ){
        google.maps.event.addListener(markerPin, 'mouseout', mouseoutFunction);
      }
      if( animatePins ){
        google.maps.event.addListener(markerPin, 'mouseup', function(){
          if( typeof animationMarker != 'undefined'){
            animationMarker.setAnimation(null);
            clearTimeout( animationTimeout );
          }
          animationMarker = this;
          animationMarker.setAnimation(google.maps.Animation.BOUNCE);
          animationTimeout = setTimeout(function(){animationMarker.setAnimation(null);},1400);
        });
      }
      pinCount--;
      if( debugPins === true ){
        tempMarkers.push({'lat':jQuery( currentPin ).attr( 'lat' ),'lng':jQuery( currentPin ).attr( 'lng' ),'marker_data':markerPin.marker_data});
        if( pinCount < 1 ){
          if(typeof console === "undefined") { console = { log: function (logMsg) { } }; }
          console.log( tempMarkers );
        }
      }
    }

    function convertXMLtoJSON( pinData ){
      var data = {};
      function Add(name, value) {
        if (data[name]) {
          if (data[name].constructor != Array) {
            data[name] = [data[name]];
          }
          data[name][data[name].length] = value;
        }
        else {
          data[name] = value;
        }
      };
      // child elements
      for( var c = 0; c < pinData.childNodes.length; c++ ){
        var cn = pinData.childNodes[c];
        if (cn.nodeType == 1) {
          if (cn.childNodes.length == 1 && ( cn.firstChild.nodeType == 3 || cn.firstChild.nodeType == 4 ) ) {
            // text value
            Add(cn.nodeName, cn.firstChild.nodeValue);
          }
          else {
            // sub-object
            Add(cn.nodeName, convertXMLtoJSON(cn));
          }
        }
      }
      return data;
    }

    function removeWhitespace(xml){
      for (var loopIndex = 0; loopIndex < xml.childNodes.length; loopIndex++){
        var currentNode = xml.childNodes[loopIndex];
        if (currentNode.nodeType == 1) removeWhitespace(currentNode);
        if (!(/\S/.test(currentNode.nodeValue)) && (currentNode.nodeType == 3)) xml.removeChild(xml.childNodes[loopIndex--]);
      }
      return xml;
    }

    function mapFullyLoaded(){
      if( typeof readyCallBackFunction != 'undefined') readyCallBackFunction( thisMap );
    }

    return _this;
  };
}( jQuery ));

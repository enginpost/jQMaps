(function ( $ ) {

  var thisMap;
  var mapStyle;
  var mapZoomFit = false;
  var animatePins = false;
  var mapBounds = new google.maps.LatLngBounds ();
  var callbackFunction;
  var pinTypes = new Array();

  jQuery.fn.buildGoogleMap = function( mapXML, thisCallbackFunction, thisMapStyle, thisStyleName ) {
    if( typeof thisMapStyle != 'undefined' ){
      if( typeof thisStyleName != 'undefined' ){
        mapStyle = new google.maps.StyledMapType( thisMapStyle, {name: thisStyleName });
      }else{
        mapStyle = new google.maps.StyledMapType( thisMapStyle, {name: "World Map"});
      }

    }

    callbackFunction = thisCallbackFunction;
    var _this = this;

    jQuery.ajax({
      type: 'GET',
      url: mapXML, // your xml file
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
      jQuery( thesePins ).find( 'marker' ).each( function( i ){
        var thisMarker = new google.maps.LatLng( jQuery( this ).attr( 'lat' ), jQuery( this ).attr( 'lng' ) );
        mapBounds.extend( thisMarker );
        var thisPin;
        switch( jQuery( this ).attr('type') ){
          case "custom" :
            thisPin = {'icon': jQuery( this ).attr('icon'), 'shadow': jQuery( this ).attr('shadow') };
            break;
          case "number" :
            // https://developers.google.com/chart/image/docs/gallery/dynamic_icons
            // <scale_factor>|<rotation_deg>|<fill_color>|<font_size>|<font_style>|<text_line_1>|...|<text_line_5>
            thisPin = {
              'icon': 'http://chart.apis.google.com/chart?chst=d_map_spin&chld=' + jQuery( this ).attr('icon'),
              'shadow': '' };
            break
          default:
            thisPin = pinTypes[ jQuery( this ).attr( 'type' ) ];
            break;
        }
        var markerPin = new google.maps.Marker({
          position: thisMarker,
          map: thisMap,
          icon: thisPin.icon,
          shadow: thisPin.shadow
        });
        markerPin.marker_data = convertXMLtoJSON(jQuery( this ).find( 'marker_data' ).get(0));
        google.maps.event.addListener(markerPin, 'click', callbackFunction);
        if( animatePins ){
          google.maps.event.addListener(markerPin, 'mouseup', function(){
            _thisMarker = this;
            _thisMarker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){_thisMarker.setAnimation(null);},1400);
          });
        }
      });
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

    return _this;
  };
}( jQuery ));

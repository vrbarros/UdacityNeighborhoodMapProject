var map;
var markers = [];

neighborhoodmap = {
  // Initial function from Google Maps javascript API
  initGoogleMaps: function () {
    // Set the Latitude and Longitude if the current user location is not available
    var defaultLocation = new google
      .maps
      .LatLng( 40.748817, -73.985428 );

    // Set the map options
    var mapOptions = {
      zoom: 15,
      center: defaultLocation,
      disableDefaultUI: true,
      zoomControl: true,
      scaleControl: true,
      streetViewControl: true,
      styles: []
    }

    // Create map object
    map = new google
      .maps
      .Map( document.getElementById( "map" ), mapOptions );

    // Create a generic info window to use when necessary
    infoWindow = new google
      .maps
      .InfoWindow();

    // Create infoWindow object to show current user location
    var currentLocation = new google
      .maps
      .InfoWindow();

    // Check if browser and user has geolocation enabled
    if ( navigator.geolocation ) {
      // Get user current location
      navigator
        .geolocation
        .getCurrentPosition( function ( position ) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          // Open the infoWindow at the map
          currentLocation.open( map );
          // Set current location considering user location
          currentLocation.setPosition( pos );
          // Update infoWindow text
          currentLocation.setContent( 'This is your position and your neighborhood.' );
          // Set the map current user location
          map.setCenter( pos );
        } );
    };

    // Create the search box and link it to the UI element.
    var input = document.getElementById( 'search-text' );
    var searchBox = new google
      .maps
      .places
      .SearchBox( input );

    // Bias the SearchBox results towards current map's viewport.
    map.addListener( 'bounds_changed', function () {
      searchBox.setBounds( map.getBounds() );
    } );

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener( 'places_changed', function () {
      var places = searchBox.getPlaces();

      if ( places.length == 0 ) {
        return;
      }

      // Remove all markers from the map
      neighborhoodmap.removeMarkers( markers );

      // For each place, get the icon, name and location.
      var bounds = new google
        .maps
        .LatLngBounds();
      places.forEach( function ( place ) {
        if ( !place.geometry ) {
          console.log( "Returned place contains no geometry" );
          return;
        }
        // Create an special icon using the place type
        var icon = {
          url: place.icon,
          size: new google
            .maps
            .Size( 71, 71 ),
          origin: new google
            .maps
            .Point( 0, 0 ),
          anchor: new google
            .maps
            .Point( 17, 34 ),
          scaledSize: new google
            .maps
            .Size( 25, 25 )
        };

        // Create a marker for each place
        var marker = new google
          .maps
          .Marker( {
            map: map,
            icon: icon,
            title: place.name,
            id: place.place_id,
            animation: google.maps.Animation.DROP,
            position: place.geometry.location
          } );

        // Update info window content

        // Add click listener to marker to open info InfoWindow
        marker.addListener( 'click', function () {

          // Set the request with place id information
          var request = {
            placeId: place.place_id
          };
          // Create PlacesServices object to request from server
          service = new google
            .maps
            .places
            .PlacesService( map );
          service.getDetails( request, callback );

          // Animation when clicked function
          marker.setAnimation( google.maps.Animation.BOUNCE );
          // Set timeout to stop animation
          setTimeout( function () {
            marker.setAnimation( null );;
          }, 2000 );

          // Function to callback if has success
          function callback( place, status ) {
            // Check if has success and retunr info window
            if ( status == google.maps.places.PlacesServiceStatus.OK ) {
              // Set variables from web webservice
              var lat = place
                .geometry
                .location
                .lat()
              var lng = place
                .geometry
                .location
                .lng()
              var name = place.name
              var address = place.formatted_address
              var phone = place.formatted_phone_number
              var website = place.website

              // Set the place content information from the web service
              content = `
                        <img style="float:left; width:200px; margin-top:30px"  src="https://maps.googleapis.com/maps/api/streetview?size=200x200&location=${ lat},${ lng}&key=AIzaSyBd3n4_Gu9itUdXG7s67DtSWfkTeK2HnYI">
                        <div style="margin-left:220px; margin-bottom:20px;">
                          <h2>${ name }</h2><p></p>`
              // Check if some variables exists
              if ( address )
                content += `<p><b>Address:</b> ${ address }</p>`
              if ( phone )
                content += `<p><b>Phone:</b> ${ phone }</p>`
              if ( website )
                content += `<p><b>Website:</b> <a target="_blank" href="${ website }">Click here</a></p>`
                // Closing the content
              content += `</div>`;

              // Update the content into the info window
              infoWindow.setContent( content );
              // Open the info window with the content
              infoWindow.open( map, marker );
            }
          }

        } );

        // Add the marker to the array
        markers.push( marker );

        // Choose between location or viewport
        if ( place.geometry.viewport ) {
          // Only geocodes have viewport.
          bounds.union( place.geometry.viewport );
        } else {
          bounds.extend( place.geometry.location );
        }
      } );
      map.fitBounds( bounds );
    } );
  },
  removeMarkers: function ( markers ) {
    // This function will loop through the listings and hide them all.
    for ( var i = 0; i < markers.length; i++ ) {
      markers[ i ].setMap( null );
    }
    // Clear the array from markers
    markers = [];
  },
  createMarker: function ( data ) {
    // This function create a market at the maps
    var marker = new google
      .maps
      .Marker( { map: map, title: data.title, animation: google.maps.Animation.DROP, position: data.location, } );
    // Add infoWindow to the marker
    marker.addListener( 'click', function () {
      // Fourquare API call using ajax
      $.ajax( {
        type: "GET", dataType: "jsonp", cache: false,
        // Use of Foursquare explore function userless authentication
        url: 'https://api.foursquare.com/v2/venues/explore?ll=' + data.location.lat + ',' + data.location.lng + '&limit=5&client_id=X2BQTIG4ZLKIHR5MNLMGYTYQQKNPPFOZ4M3VKZMFOG3BM0FK&client_secret=PRMMJ4ODYXHVLDJ2V0INOE5SM51F0XBPN3BHR04M5XF1JNFE&v=20171227',
        success: function ( result ) {
          // Get all 5 results
          var base = result
            .response
            .groups[ 0 ]
            .items;

          // Create content variable to fill about the place
          var content = `<strong>${ data.title }</strong><br /><br /> Recommended near places (by Foursquare): <br />`;

          // Loop each result and add to content
          $.each( base, function ( index ) {

            var url = base[ index ].venue.url;
            var name = base[ index ].venue.name;

            content += `<strong>${ name}</strong> <a href="${ url }" target="_blank">view more</a> <br />
                            `;
          } );

          // Update the content into the info window
          infoWindow.setContent( content );
          // Open the info window with the content
          infoWindow.open( map, marker );
        },
        error: function ( jqXHR, status, err ) {
          // Show error message
          alert( "Status: " + status );
          alert( "Error: " + err );
        }
      } );
    } );

    // Add the marker to the array
    markers.push( marker );
    // Change map position
    map.setCenter( data.location );
  },
  loadMarkers: function ( data ) {
    // Set the bounds
    var bounds = new google
      .maps
      .LatLngBounds();
    // Iterate all Locations
    data.forEach( function ( location ) {
      // Create each mark re-using the function create marker
      neighborhoodmap.createMarker( location );
      // Extend bounds
      bounds.extend( location.location );
    } );

    // Adjust the viewport
    map.fitBounds( bounds );
  }
}

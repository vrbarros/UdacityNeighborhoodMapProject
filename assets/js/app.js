// Create App View Model

var Model = function () {
  var self = this;
  self.Locations = [
    {
      title: 'Park Ave Penthouse',
      location: {
        lat: 40.7713024,
        lng: -73.9632393
      }
    },
    {
      title: 'Chelsea Loft',
      location: {
        lat: 40.7444883,
        lng: -73.9949465
      }
    },
    {
      title: 'Union Square Open Floor Plan',
      location: {
        lat: 40.7347062,
        lng: -73.9895759
      }
    },
    {
      title: 'East Village Hip Studio',
      location: {
        lat: 40.7281777,
        lng: -73.984377
      }
    },
    {
      title: 'TriBeCa Artsy Bachelor Pad',
      location: {
        lat: 40.7195264,
        lng: -74.0089934
      }
    },
    {
      title: 'Chinatown Homey Space',
      location: {
        lat: 40.7180628,
        lng: -73.9961237
      }
    }
  ];
};

model = new Model();

var AppViewModel = {
  // Load Locations
  locations: ko.observableArray(model.Locations),
  // Search text input field
  search: ko.observable(''),
  shouldClear: ko.observable(false),

  // Select location based on a list
  selectLocation: function (data) {
    // Remove all markers from the map
    neighborhoodmap.removeMarkers(markers);

    // This function create a market at the maps
    var marker = new google.maps.Marker({
      map: map,
      title: data.title,
      animation: google.maps.Animation.DROP,
      position: data.location,
    });

    // Add the marker to the array
    markers.push(marker);

    // Change map position
    map.setCenter(data.location);
  },
  // Mark all favorite locations
  allFavorite: function () {
    // Remove all markers from the map
    neighborhoodmap.removeMarkers(markers);

    // Set the bounds
    var bounds = new google.maps.LatLngBounds();

    // Iterate all Locations
    ko.utils.arrayForEach(this.locations(), function (location) {
      var marker = new google.maps.Marker({
        map: map,
        title: location.title,
        animation: google.maps.Animation.DROP,
        position: location.location,
      });
      // Add the marker to the array
      markers.push(marker);

      // Extend bounds
      bounds.extend(location.location);
    });

    // Adjust the viewport
    map.fitBounds(bounds);
  },
  // Search console controls after changes in search input
  searchConsole: function () {
    // Set the state to show or hide
    if (this.search() === '') {
      // Hide the clear button
      this.shouldClear(false);
    } else {
      // Show the clear button
      this.shouldClear(true);
    }
  },
  // Clear the text from search input field
  clearSearch: function () {
    // Set text to empty
    this.search('');
    // Hide the clear button again
    this.searchConsole();
    // Remove all markers from the map
    neighborhoodmap.removeMarkers(markers);
  }

};

// Data-binding the View Model object
ko.applyBindings(AppViewModel);

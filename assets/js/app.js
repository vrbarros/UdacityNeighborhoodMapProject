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
    }, {
      title: 'Chelsea Loft',
      location: {
        lat: 40.7444883,
        lng: -73.9949465
      }
    }, {
      title: 'Union Square Open Floor Plan',
      location: {
        lat: 40.7347062,
        lng: -73.9895759
      }
    }, {
      title: 'East Village Hip Studio',
      location: {
        lat: 40.7281777,
        lng: -73.984377
      }
    }, {
      title: 'TriBeCa Artsy Bachelor Pad',
      location: {
        lat: 40.7195264,
        lng: -74.0089934
      }
    }, {
      title: 'Chinatown Homey Space',
      location: {
        lat: 40.7180628,
        lng: -73.9961237
      }
    },
  ];
};

model = new Model();

var AppViewModel = {
  // Load Locations
  locations: ko.observableArray( model.Locations ),
  filtered: ko.observableArray( [] ),
  // Search text input field
  search: ko.observable( '' ),
  filter: ko.observable( '' ),
  shouldClear: ko.observable( false ),

  // Select location based on a list
  selectLocation: function ( data ) {
    // Remove all markers from the map
    neighborhoodmap.removeMarkers( markers );
    // Create the marker on the map
    neighborhoodmap.createMarker( data, true );

  },
  loadMarkers: function ( array ) {
    // Remove all markers from the map
    neighborhoodmap.removeMarkers( markers );
    // Loads the array in the map
    neighborhoodmap.loadMarkers( array );
  },
  // Mark all favorite locations
  allFavorite: function () {
    // Clean the filtered and search fields
    this.resetConsole();
    // Load markers from all favorites
    this.loadMarkers( this.locations() );
  },
  // Show favorite filtered on the map
  filteredFavorites: function () {
    this.loadMarkers( this.filtered() );
  },
  // Search console controls after changes in search input
  searchConsole: function () {
    // Set the state to show or hide
    if ( this.search() === '' ) {
      // Hide the clear button
      this.shouldClear( false );
    } else {
      // Show the clear button
      this.shouldClear( true );
    }
  },
  // Start the favorite list
  favoriteList: function () {
    // Remove all items
    this
      .filtered
      .removeAll();

    for ( var i = 0; i < this.locations().length; i++ ) {
      this
        .filtered
        .push( this.locations()[ i ] );
    };
  },
  // Filter console controls after changes in filter input
  filterConsole: function () {
    filter = this.filter()
    // Set the state to show or hide
    if ( filter === '' ) {
      // Hide the clear button
      this.resetConsole();

    } else {
      // Show the clear button
      this.shouldClear( true );

      // Remove all items
      this
        .filtered
        .removeAll();

      // Filter each item testing characters
      var test = ko
        .utils
        .arrayFilter( this.locations(), function ( item ) {
          var title = item
            .title
            .toLowerCase();
          if ( title !== 'undefined' ) {
            return title.includes( filter );
          } else {
            return false;
          }
        } );

      // If has some value found
      if ( test.length > 0 ) {
        // Save each result into the obsersavable array
        for ( var i = 0; i < test.length; i++ ) {
          this
            .filtered
            .push( test[ i ] );
        };
      }

      // Show the filtered results
      this.filteredFavorites( this.filtered() )

    }
  },
  // Clear the text from search input field
  clearSearch: function () {
    this.resetConsole();
  },
  // Reset general console
  resetConsole: function () {
    // Set text to empty
    this.search( '' );
    this.filter( '' );
    // Hide the clear button again
    this.searchConsole();
    // Reload all favorites liste
    this.favoriteList();
    // Remove all markers from the map
    neighborhoodmap.removeMarkers( markers );
  },
};

// Data-binding the View Model object
ko.applyBindings( AppViewModel );

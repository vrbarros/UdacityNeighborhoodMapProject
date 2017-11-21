// Create App View Model

var AppViewModel = {
  // Search text input field
  search: ko.observable(''),
  shouldClear: ko.observable(false),

  // Search console controls after changes in search input
  searchConsole: function() {
    // Set the state to show or hide
    if (this.search() == '') {
      // Hide the clear button
      this.shouldClear(false);
    } else {
      // Show the clear button
      this.shouldClear(true);
    }
  },
  // Clear the text from search input field
  clearSearch: function() {
    // Set text to empty
    this.search('');
    // Hide the clear button again
    this.searchConsole();
    // Clear wikipedia
    clearWikipedia();
    // Remove all markers from the map
    neighborhoodmap.removeMarkers(markers);
  }

};

// Data-binding the View Model object
ko.applyBindings(AppViewModel);

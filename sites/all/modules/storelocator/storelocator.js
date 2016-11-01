(function($){
  Drupal.behaviors.storelocator = {
    attach: function(context, settings) {
      var target_point = new google.maps.LatLng(Drupal.settings.storelocator.lat, Drupal.settings.storelocator.lng);

      var mapOptions = {
        zoom: parseInt(Drupal.settings.storelocator.zoom),
        center: target_point,
        mapTypeId: eval(Drupal.settings.storelocator.type),
        mapTypeControl: true
        };

      var map = new google.maps.Map(document.getElementById("storelocator_map"), mapOptions);

      var markerOptions = {
        position: target_point,
        draggable: Drupal.settings.storelocator.admin,
        map: map
      };

      var marker = new google.maps.Marker(markerOptions);

      var infowindow = new google.maps.InfoWindow({
        content: Drupal.settings.storelocator.info
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });

      // Allow fine tuning of the marker position in admin mode.
      if (Drupal.settings.storelocator.admin) {

        google.maps.event.addListener(marker, 'dragend', function(event) {
          $('#edit-storelocator-lat').val(event.latLng.lat());
          $('#edit-storelocator-lng').val(event.latLng.lng());
        });

        google.maps.event.addListener(map, 'zoom_changed', function(event) {
          $('#edit-storelocator-zoom').val(map.getZoom());
        });
      }
    }
  };
})(jQuery);
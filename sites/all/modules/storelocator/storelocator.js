(function($){
  Drupal.behaviors.storelocator = {
    attach: function(context, settings) {


// This will let you use the .remove() function later on
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';


  var filterInput = document.getElementById('filter-input');
  var map = new mapboxgl.Map({
    // container id specified in the HTML
    container: 'storelocator_map',
    // style URL
    style: 'mapbox://styles/mapbox/light-v9',
    // initial position in [long, lat] format
    center: [172.101973, -41.485665],
    // initial zoom
    zoom: 5
  });

  var stores = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            167.713833,
            -45.416728
          ]
        },
        "properties": {
          "phoneFormatted": "(09) 2234-7336",
          "phone": "0922347336",
          "address": "38 Town Centre, Te Anau 9600",
          "city": "Te Anau",
          "country": "New Zealand",
          "crossStreet": "",
          "postalCode": "",
          "state": "NI",
          "attractionName": "Vive La Revolution Te Anau",
          "attractionType": "Road | MTB",
          "attractionUrl": "#",
          "desc": "<p>Handing store right in the town centre.</p>",
          "img": "images/stores/store2.jpg",
          "icon": {
            "bgImg": "images/marker.png"
          }
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            168.348879,
            -46.413231,
          ]
        },
        "properties": {
          "phoneFormatted": "(07) 856-2889",
          "phone": "078562889",
          "address": "21 Tay St, Invercargill, 9810",
          "city": "Invercargill",
          "country": "New Zealand",
          "crossStreet": "",
          "postalCode": "9810",
          "state": "NI",
          "attractionName": "Vive La Revolution Invercargill",
          "attractionType": "Road | MTB | Track",
          "attractionUrl": "#",
          "desc": "<p>Situated in the deep south of New Zealand, Invercargill has some great trails.</p>",
          "img": "images/stores/store1.png",
          "icon": {
            "bgImg": "images/marker.png"
          }
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            168.665070,
            -45.030619
          ]
        },
        "properties": {
          "phoneFormatted": "(07) 854-7813",
          "phone": "07-854 7813",
          "address": "4 Brecon St, Queenstown 9300",
          "city": "Queenstown",
          "country": "New Zealand",
          "crossStreet": "",
          "postalCode": "9300",
          "state": "NI",
          "attractionName": "Vive La Revolution Queenstown",
          "attractionType": "Road | MTB",
          "attractionUrl": "#",
          "desc": "<p>AStunning bicycles in a stunning location.</p>",
          "img": "images/stores/store3.jpg",
          "icon": {
            "bgImg": "images/marker.png"
          }
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            170.506455,
            -45.874873
          ]
        },
        "properties": {
          "phoneFormatted": "(09) 2234-7336",
          "phone": "0922347336",
          "address": "67 Stuart St, Dunedin, 9016",
          "city": "Dunedin",
          "country": "New Zealand",
          "crossStreet": "",
          "postalCode": "",
          "state": "NI",
          "attractionName": "Vive La Revolution Dunedin",
          "attractionType": "Road",
          "attractionUrl": "#",
          "desc": "<p>Best road cycling in the country which is why we stock the best bikes.</p>",
          "img": "images/stores/store4.jpg",
          "icon": {
            "bgImg": "images/marker.png"
          }
        }
      }]
  };
  // This adds the data to the map
  map.on('load', function (e) {
    // Add a GeoJSON source containing place coordinates and information.
    map.addSource("places", {
      "type": "geojson",
      "data": stores
    });
    // This is where your '.addLayer()' used to be
    // Initialize the list
    var filter = "";
    buildLocationList(stores);

  });

  // This is where your interactions with the symbol layer used to be
  // Now you have interactions with DOM markers instead
  stores.features.forEach(function(marker, i) {

    // Create an img element for the marker
    var el = document.createElement('div');
    el.id = "marker-" + i;
    el.style.backgroundImage = "url(" + marker.properties.icon.bgImg + ")";
    el.className = 'marker';
    el.style.left='-28px';
    el.style.top='-46px';

    // Add markers to the map at all points
    new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

    el.addEventListener('click', function(e){
      // 1. Fly to the point
      flyToStore(marker);

      // 2. Close all other popups and display popup for clicked store
      createPopUp(marker);

      // 3. Highlight listing in sidebar (and remove highlight for all other listings)
      var activeItem = document.getElementsByClassName('active');

      e.stopPropagation();
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }

      var listing = document.getElementById('listing-' + i);
      listing.classList.add('active');

    });
  });


  function flyToStore(currentFeature) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15
    });
  }

  function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();


    var popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3>' + currentFeature.properties.attractionName + '</h3>' +
            '<h4>' + currentFeature.properties.address + '</h4>' +
        '<form action="' + currentFeature.properties.attractionUrl + '"><button type="submit">EXPLORE</button></form>')
        .addTo(map);
  }


  filterInput.addEventListener('keyup', function(e) {
    // If the input value matches a layerID set
    // it's visibility to 'visible' or else hide it.

    var value = e.target.value.trim().toLowerCase();
    var listings = document.getElementById('listings');
    var i = 0;
    jQuery('.tags').each(function(){

      var tagVals = $(this).html();
      if (isTextInputTagMatch(value, tagVals))
      {
        $(this).parent().show();
      }
      else
      {
        $(this).parent().hide();
      }

    });

    /*
    listings.children.forEach(function() {

      listings.style.display =
          layerID.indexOf(value) > -1 ? 'visible' : 'none');

      var tags = document.getElementById('tags-' + i);
      alert('>' + tags.innerHTML);
      i++;
    });
       */

  });

  function isTextInputTagMatch(txtInput, tags)
  {
    var tagArr = tags.substring(tags.indexOf(':')+1);
    /*var tagArr = tags.substring(tags.indexOf(':')+1).split(';');
    for (i = 0; i < tagArr.length; i++){*/
    var inputIndex = tagArr.trim().toLowerCase().indexOf(txtInput);
      if (inputIndex > -1)
        return true;
    //}
    return false;
  }

  function buildLocationList(data) {
    for (i = 0; i < data.features.length; i++) {
      var currentFeature = data.features[i];
      var prop = currentFeature.properties;

      var listings = document.getElementById('storelocator_listings');
      var listing = listings.appendChild(document.createElement('div'));
      listing.className = 'item';
      listing.id = "listing-" + i;

      var teaserImg = listing.appendChild(document.createElement('div'));
      teaserImg.className = "teaser";
      var thumbnail = teaserImg.appendChild(document.createElement('img'));
      thumbnail.src = prop.img;
      thumbnail.alt = "img alt";
      thumbnail.title = "img title";

      var link = listing.appendChild(document.createElement('a'));
      link.href = '#';
      link.className = 'title';
      link.dataPosition = i;
      link.innerHTML = prop.attractionName;

      var contact = listing.appendChild(document.createElement('div'));
      if (prop.address) {
        contact.className = "contact";
        contact.innerHTML += prop.address;
      }
      if (prop.phone) {
        contact.innerHTML += "<br/>" + prop.phoneFormatted;
      }

      var desc = listing.appendChild(document.createElement('div'));
      desc.className = "desc";
      desc.innerHTML = prop.desc;

      var tags = listing.appendChild(document.createElement('div'));
      tags.id = "tags-" + i;
      tags.className = "tags";
      tags.innerHTML += 'TAGS: ' + prop.attractionType;



      link.addEventListener('click', function(e){
        // Update the currentFeature to the store associated with the clicked link
        var clickedListing = data.features[this.dataPosition];

        // 1. Fly to the point
        flyToStore(clickedListing);

        // 2. Close all other popups and display popup for clicked store
        createPopUp(clickedListing);

        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        var activeItem = document.getElementsByClassName('active');

        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        this.parentNode.classList.add('active');

      });
    }
  }










/*  FROM HERE IS OLD */
/*
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


*/

    }
  };
})(jQuery);
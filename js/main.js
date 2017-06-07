var markers = [];
var map;
function initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: {lat: 19.0760, lng: 72.8777}
    });
    for(var i=0; i<initialPlaceList.length; i++){
        var marker = new google.maps.Marker({
            position: initialPlaceList[i].position,
            animation: google.maps.Animation.DROP,
            title: initialPlaceList[i].name
          });
        marker.addListener('click', function(e){
            toggleBounce(this);
        });
        markers.push(marker);
    }
    showMarkers(markers);
}

function toggleBounce(marker){
    hideMarkers(markers);
    marker.setMap(map);
    if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function showMarkers(markers){
    for(var i=0; i<markers.length; i++){
        markers[i].setMap(map);
    }
}

function hideMarkers(markers){
    for(var i=0; i<markers.length; i++){
        markers[i].setMap(null);
    }
}

var Place = function(data){
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
}

var initialPlaceList=[
    {
        name:'Mumbai',
        position:{
            lat : 19.0760,
            lng : 72.8777
        }
    },
    {
        name:'Pune',
        position : {
            lat : 18.5204,
            lng : 73.8567
        }
    },
    {
        name:'Goa',
        position : {
            lat : 15.2993,
            lng : 74.1240
        }
    },
    {
        name:'Kolhapur',
        position : {
            lat : 16.7050,
            lng : 74.2433
        }
    },
    {
        name: 'Ahmedabad',
        position:{
            lat : 23.0225,
            lng : 72.5714
        }
    }

];

var ViewModel = function(){
    var self = this;
    this.placeList = ko.observableArray([]);

    initialPlaceList.forEach(function(place){
        this.placeList.push(new Place(place));
    }, this);

    this.changePlace = function(place){
        hideMarkers(markers);
        markers = [];
        var marker = new google.maps.Marker({
            position: place.position(),
            title: place.name()
          });
        marker.setAnimation(google.maps.Animation.BOUNCE);
        markers.push(marker);
        showMarkers(markers);

    }
}
ko.applyBindings(new ViewModel());
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat: -34.397, lng: 150.644}
    });
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
        console.log(place);
    }
}
ko.applyBindings(new ViewModel());
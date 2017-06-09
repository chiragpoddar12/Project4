var markers = [];
var map;
function initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: {lat: 19.0760, lng: 72.8777}
    });
    var infowindow = new google.maps.InfoWindow({
        });
    for(var i=0; i<initialPlaceList.length; i++){
        var marker = new google.maps.Marker({
            position: initialPlaceList[i].position,
            animation: google.maps.Animation.DROP,
            title: initialPlaceList[i].name
          });
        marker.addListener('click', (function(marker){
            return function() {
                infowindow.setContent(marker.getTitle());
                infowindow.open(map, marker);
                var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.getTitle()+'&format=json&callback=wikiCallback';
                $("#wikiArticles").empty();
                $.ajax({
                    url : wikiUrl,
                    dataType : 'jsonP',
                    success : function(response){
                        articleList = response[1];
                        urlList = response[3];
                        // console.log(response)
                        for(var i=0; i<articleList.length; i++){
                            articleStr = articleList[i];
                            var wUrl = urlList[i];
                            $("#wikiArticles").append('<li><a href="'+wUrl+'">'+articleStr+'</a></li>');
                        }
                    }
                });

            };
        })(marker));
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

function loadList(){
    var query = $("#inPlace").val();
    $("#placeList").empty();
    var filterList = [];
    for(var i=0; i<initialPlaceList.length; i++){
        if(query == initialPlaceList[i].name){
            filterList.push(initialPlaceList[i]);
        }
    }
}

var Place = function(data){
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
};

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
        var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+place.name()+'&format=json&callback=wikiCallback';
        $("#wikiArticles").empty();
        $.ajax({
            url : wikiUrl,
            dataType : 'jsonP',
            success : function(response){
                articleList = response[1];
                urlList = response[3]
                for(var i=0; i<articleList.length; i++){
                    articleStr = articleList[i];
                    var wUrl = urlList[i];
                    $("#wikiArticles").append('<li><a href="'+wUrl+'">'+articleStr+'</a></li>');
                }
            }
        });

        hideMarkers(markers);
        markers = [];
        var marker = new google.maps.Marker({
            position: place.position(),
            title: place.name()
          });
        var infowindow = new google.maps.InfoWindow({
          content: place.name()
        });
        marker.setAnimation(google.maps.Animation.BOUNCE);

        marker.addListener('click', (function(infowindow,marker){
            return function() {
                if(infowindow.anchor === null){
                    infowindow.open(map, marker);
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }else{
                    infowindow.close();
                    marker.setAnimation(null);
                }
            };
        })(infowindow,marker));
        markers.push(marker);
        showMarkers(markers);
    };

    this.filterItems = function(){
        var query = $("#inPlace").val();
        $("#placeList").empty();
        if(query !== ""){
            var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+query+'&format=json&callback=wikiCallback';
            $("#wikiArticles").empty();
            $.ajax({
                url : wikiUrl,
                dataType : 'jsonP',
                success : function(response){
                    articleList = response[1];
                    urlList = response[3];
                    console.log(response);
                    for(var i=0; i<articleList.length; i++){
                        articleStr = articleList[i];
                        var wUrl = urlList[i];
                        $("#wikiArticles").append('<li><a href="'+wUrl+'">'+articleStr+'</a></li>');
                    }
                }
            });
        }
        else{
            $("#wikiArticles").empty();
        }
        this.placeList.removeAll();
        var filterList = [];
        for(var i=0; i<initialPlaceList.length; i++){
            if(query === ""){
                filterList.push(initialPlaceList[i]);
            }else{
                if(query == initialPlaceList[i].name){
                    filterList.push(initialPlaceList[i]);
                }
            }
        }

        filterList.forEach(function(place){
            this.placeList.push(new Place(place));
        }, this);
        var marker;
        var infowindow = new google.maps.InfoWindow({
            });
        hideMarkers(markers);
        markers = [];

        this.placeList().forEach(function(place){
            marker = new google.maps.Marker({
            position: place.position(),
            title: place.name()
              });

            marker.addListener('click', (function(marker){
            return function() {
                infowindow.setContent(marker.getTitle());
                infowindow.open(map, marker);
                var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+marker.getTitle()+'&format=json&callback=wikiCallback';
                $("#wikiArticles").empty();
                $.ajax({
                    url : wikiUrl,
                    dataType : 'jsonP',
                    success : function(response){
                        articleList = response[1];
                        urlList = response[3];
                        console.log(response);
                        for(var i=0; i<articleList.length; i++){
                            articleStr = articleList[i];
                            var wUrl = urlList[i];
                            $("#wikiArticles").append('<li><a href="'+wUrl+'">'+articleStr+'</a></li>');
                        }
                    }
                });
            };
        })(marker));
            markers.push(marker);
        });
        showMarkers(markers);
    };
};
ko.applyBindings(new ViewModel());
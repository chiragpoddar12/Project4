var markers = [];
var map;
var infowindow;
var controller;
// initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {
            lat: 19.0760,
            lng: 72.8777
        }
    });

    infowindow = new google.maps.InfoWindow({});

    //add markers to the map
    for (var i = 0; i < initialPlaceList.length; i++) {
        var marker = new google.maps.Marker({
            position: initialPlaceList[i].position,
            animation: google.maps.Animation.DROP,
            title: initialPlaceList[i].name
        });
        marker.addListener('click', (markerListener)(marker));
        markers.push(marker);
    }
    showMarkers(markers);
}

//error method for mao
function mapError(oError) {
    alert("Error loading map. Try again later");
}

//marker listener
function markerListener(marker) {
    return function() {
        infowindow.setContent(marker.getTitle());
        infowindow.open(map, marker);
        markers.forEach(function(tempMarker) {
            tempMarker.setAnimation(null);
        });
        marker.setAnimation(google.maps.Animation.BOUNCE);
        var wikiRequestTimeout = setTimeout(function(){
            alert("Could not connect to wikipedia for articles");
        },10000);
        var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.getTitle() + '&format=json&callback=wikiCallback';
        $.ajax({
            url: wikiUrl,
            dataType: 'jsonP',
            success: function(response) {
                controller.articlesList.removeAll();
                var articles = [];
                var articleList = response[1];
                var urlList = response[3];
                for (var i = 0; i < articleList.length; i++) {
                    articles.push({
                        title: articleList[i],
                        url: urlList[i]
                    });
                }
                articles.forEach(function(article) {
                    controller.articlesList.push(new Article(article));
                }, controller);

                clearTimeout(wikiRequestTimeout);
            },
            error: function(error) {
                alert("Could not connect to wikipedia for articles");
            }
        });
    };
}

function toggleBounce(marker) {
    hideMarkers(markers);
    marker.setMap(map);
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function showMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

var Article = function(data) {
    this.title = ko.observable(data.title);
    this.url = ko.observable(data.url);
};

var Place = function(data) {
    this.name = ko.observable(data.name);
    this.position = ko.observable(data.position);
};

//model
var initialPlaceList = [{
        name: 'Mumbai',
        position: {
            lat: 19.0760,
            lng: 72.8777
        }
    },
    {
        name: 'Pune',
        position: {
            lat: 18.5204,
            lng: 73.8567
        }
    },
    {
        name: 'Goa',
        position: {
            lat: 15.2993,
            lng: 74.1240
        }
    },
    {
        name: 'Kolhapur',
        position: {
            lat: 16.7050,
            lng: 74.2433
        }
    },
    {
        name: 'Ahmedabad',
        position: {
            lat: 23.0225,
            lng: 72.5714
        }
    }

];

//viewModel
var ViewModel = function() {
    controller = this;
    var self = this;
    this.placeList = ko.observableArray([]);
    this.articlesList = ko.observableArray([]);
    this.query = ko.observable("");
    var articles = [];
    initialPlaceList.forEach(function(place) {
        this.placeList.push(new Place(place));
    }, this);

    //change of place binder
    this.changePlace = function(place) {
        var wikiRequestTimeout = setTimeout(function(){
            alert("Could not connect to wikipedia for articles");
        },10000);
        var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + place.name() + '&format=json&callback=wikiCallback';
        $.ajax({
            url: wikiUrl,
            dataType: 'jsonP',
            success: function(response) {
                self.articlesList.removeAll();
                articles = [];
                articleList = response[1];
                urlList = response[3];
                for (var i = 0; i < articleList.length; i++) {
                    articles.push({
                        title: articleList[i],
                        url: urlList[i]
                    });
                }
                articles.forEach(function(article) {
                    self.articlesList.push(new Article(article));
                }, self);
                clearTimeout(wikiRequestTimeout);
            },
            error: function(error) {
                alert("Could not connect to wikipedia for articles");
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

        marker.addListener('click', (function(infowindow, marker) {
            return function() {
                if (infowindow.anchor === undefined || infowindow.anchor === null) {
                    infowindow.open(map, marker);
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                } else {
                    infowindow.close();
                    marker.setAnimation(null);
                }
            };
        })(infowindow, marker));
        markers.push(marker);
        showMarkers(markers);
    };

    //filter handle
    this.filterItems = function() {
        if (this.query() !== "") {
            var wikiRequestTimeout = setTimeout(function(){
                alert("Could not connect to wikipedia for articles");
            },10000);
            var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + this.query() + '&format=json&callback=wikiCallback';
            $.ajax({
                url: wikiUrl,
                dataType: 'jsonP',
                success: function(response) {
                    self.articlesList.removeAll();
                    articles = [];
                    articleList = response[1];
                    urlList = response[3];
                    for (var i = 0; i < articleList.length; i++) {
                        articles.push({
                            title: articleList[i],
                            url: urlList[i]
                        });
                    }
                    articles.forEach(function(article) {
                        self.articlesList.push(new Article(article));
                    }, self);
                    clearTimeout(wikiRequestTimeout);
                },
                error: function(error) {
                    alert("Could not connect to wikipedia for articles");
                }
            });
        } else {
            self.articlesList.removeAll();
            articles = [];
        }
        this.placeList.removeAll();
        for (var i = 0; i < initialPlaceList.length; i++) {
            if (this.query() === "") {
                this.placeList.push(new Place(initialPlaceList[i]));
            } else {
                if (initialPlaceList[i].name.toLowerCase().indexOf(this.query()) >= 0) {
                    this.placeList.push(new Place(initialPlaceList[i]));
                }
            }
        }
        var marker;
        var infowindow = new google.maps.InfoWindow({});
        hideMarkers(markers);
        markers = [];

        this.placeList().forEach(function(place) {
            marker = new google.maps.Marker({
                position: place.position(),
                title: place.name()
            });

            marker.addListener('click', (function(marker) {
                return function() {
                    infowindow.setContent(marker.getTitle());
                    infowindow.open(map, marker);
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    var wikiRequestTimeout = setTimeout(function(){
                        alert("Could not connect to wikipedia for articles");
                    },10000);
                    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.getTitle() + '&format=json&callback=wikiCallback';
                    $.ajax({
                        url: wikiUrl,
                        dataType: 'jsonP',
                        success: function(response) {
                            self.articlesList.removeAll();
                            articles = [];
                            articleList = response[1];
                            urlList = response[3];
                            for (var i = 0; i < articleList.length; i++) {
                                articles.push({
                                    title: articleList[i],
                                    url: urlList[i]
                                });
                            }
                            articles.forEach(function(article) {
                                self.articlesList.push(new Article(article));
                            }, self);
                            clearTimeout(wikiRequestTimeout);
                        },
                        error: function(error) {
                            alert("Could not connect to wikipedia for articles");
                        }
                    });
                };
            })(marker));
            markers.push(marker);
        });
        showMarkers(markers);
    };
};
// ViewModel.query.subscribe(ViewModel.filterItems);
ko.applyBindings(new ViewModel());
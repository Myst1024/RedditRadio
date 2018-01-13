var app = angular.module('postList', ['ngSanitize']);

app.controller('displayPosts', function($scope, $http, $sce) {
    $http.get("https://www.reddit.com/r/listentothis.json?raw_json=1&limit=50")
        .then(function(response) {
            var posts = response.data.data.children;
            posts = posts.filter(function(post){
                return post.data.domain !== 'self.listentothis';
            });

            posts = posts.map(function(post){ //taking out "kind" json keys, returning only child data
                post.data.parsedTitle = parseTitle(post.data.title); //inserting parsed song info into post.data
                return post.data;
            });

            var filteredPosts = posts.filter(filterYoutube);
            $scope.apiResults = filteredPosts;
        });

    $scope.setPlaying = function(url) {
        $scope.playingIframe = $sce.trustAsHtml(url);
    }
});

parseTitle = function(title) {
    var songInfo = {};
    var titleRegex = /(.+)(?: (?:--|-|—|–) )(.+) ?\[(.+)\] ?(?:\(?(\d+)\)?)?/;

    var decodedTitle = decodeURI(title);

    var splitTitle = titleRegex.exec(decodedTitle);

    songInfo.artist = splitTitle[1];
    songInfo.song = splitTitle[2];
    songInfo.genre = splitTitle[3];
    songInfo.year = splitTitle[4];

    return songInfo;
};

function filterYoutube(url) {
    return (url.media.type === "youtube.com")
}
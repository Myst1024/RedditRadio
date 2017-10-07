var app = angular.module('postList', []);

app.controller('displayPosts', function($scope, $http) {
    $http.get("https://www.reddit.com/r/listentothis.json?raw_json=1&limit=10")
        .then(function(response) {
            var posts = response.data.data.children;
            posts = posts.filter(function(post){
                return post.data.domain !== 'self.listentothis';
            });

            posts = posts.map(function(post){ //taking out "kind" json keys, returning only child data
                post.data.parsedTitle = parseTitle(post.data.title); //inserting parsed song info into post.data
                return post.data;
            });

            $scope.apiResults = posts;
        });
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
require("dotenv").config();
var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var twitter = require("twitter");
var fs = require("fs");
var request = require("request");




function movieThis() {
	var movieName = "";
	var movieURL = "";
	if (process.argv.length === 2)
		movieName = "Mr. Nobody"
	else {
		for (var i = 2; i < process.argv.length; i++) {
			if (i > 2 && i < process.argv.length) {
				movieName += "+" + process.argv[i];
			}
			else
				movieName = process.argv[i];
		}
	}
	movieURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	console.log(movieURL + "movie URL");

	request(movieURL, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var movieDeets = JSON.parse(body);
			console.log(JSON.parse(body));
			console.log("Title: " + movieDeets.Title + "\n" +
				"Release Year: " + movieDeets.Year + "\n" +
				"IMDB Rating: " + movieDeets.Ratings[0].Value + "\n" +
				"Rotten Tomatoes score: " + movieDeets.Ratings[1].Value + "\n" +
				"Produced in: " + movieDeets.Country + "\n" +
				"Language: " + movieDeets.Language + "\n" +
				"Plot Description: " + movieDeets.Plot + "\n" +
				"Actors: " + movieDeets.Actors);
		}
		else
			console.log(error + response.statusCode);
	})
}

function myTweets() {
	var client = new twitter(keys.twitter);
	var params = { screen_name: 'Bowzler', count: '20' };
	client.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (!error) {
			console.log(tweets);
			for (var i = 0; i < tweets.length; i++) {
				console.log("Tweet: " + tweets[i].text);
				console.log("Created at: " + tweets[i].created_at);
			}
		}
		else
			console.log(error);
	});
}
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from

function spotifyThisSong() {
	var spot = new spotify(keys.spotify);
	var song = "";
	if (process.argv.length === 2)
		song = "The Sign";
	else {
		for (var i = 2; i < process.argv.length; i++) {
			if (i > 2 && i < process.argv.length) {
				song += "%20" + process.argv[i];
			}
			else
				song = process.argv[i];
		}
	}
	console.log(song);
	spot.search({ type: 'track', query: song, limit: 1 }, function (error, data) {
		if (!error) {
			console.log("Artist(s): " + JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2) + "\n"
				+ "Song: " + JSON.stringify(data.tracks.items[0].name, null, 2) + "\n"
				+ "Album: " + JSON.stringify(data.tracks.items[0].album.name, null, 2) + "\n"
				+ "Link: " + JSON.stringify(data.tracks.items[0].preview_url, null, 2)
			);
		}
		else
			console.log(error);
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function (err, data) {
		if (err) {
			return console.log(err);
		}
		else {
			data.split(",");
		}
	});
}
// movieThis();
// myTweets();
// spotifyThisSong();
doWhatItSays();

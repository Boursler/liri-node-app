require("dotenv").config();
var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var twitter = require("twitter");
var fs = require("fs");
var request = require("request");




function movieThis(movieName) {

	var movieURL = "";
	if (movieName === 0)
		movieName = "Mr. Nobody"

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

function spotifyThisSong(song) {
	var spot = new spotify(keys.spotify);
	if (song === "")
		song = "The Sign";

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
	var dataArr = [];
	var doWhat = {};
	var method;
	var name;
	fs.readFile("random.txt", "utf8", function (err, data) {
		console.log("hello");
		if (err) {
			return console.log(err);
		}
		else {
			dataArr = data.split(",");
			method = dataArr[0];
			name = dataArr[1].split(" ");
			doWhat = { method: method, name: name };
			console.log(doWhat);

		}

	});
	return doWhat;
}
// movieThis();
// myTweets();
// spotifyThisSong();
// doWhatItSays();
// `my-tweets`
// * `spotify-this-song`
// * `movie-this`
// * `do-what-it-says`

function dispatch() {
	var choice = process.argv[2];
	var argument = process.argv.slice[3];
	var itSays = {};
	if (choice === "do-what-it-says") {
		itSays = doWhatItSays();
		console.log("itSays " + JSON.stringify(itSays));
		choice = itSays.method;
		argument = itSays.name;
	};
	console.log("choice value + " + choice);
	if (choice === "my-tweets") {
		console.log("my tweets");
		myTweets();
	}
	else if (choice === "spotify-this-song") {
		console.log("spotify");
		var song = "";
		for (var i = 0; i < argument.length; i++) {
			if (i > 0 && i < argument.length) {
				song += "%20" + argument[i];
			}
			else
				song = argument[i];
		}
		spotifyThisSong(song);
		console.log(song);
	}
	else if (choice === "movie-this") {
		var movieName = "";
		for (var i = 0; i < argument.length; i++) {
			if (i > 0 && i < argument.length) {
				movieName += "+" + argument[i];
			}
			else
				movieName = argument[i];
		}
		movieThis(movieName);
	}
}
dispatch();

var express = require('express');
var request = require('request-promise') //makes sending GET requests in node easier - this is the promisified version (JW)
var Path = require('path');
var routes = express.Router();


//*** FOR DEV PURPOSES ONLY *** replace with environment variables once deployed (JW)
var apiKeys = require('./apiKeys.js')
	//currently, justin has these stored locally - file is gitignored.
	//HOW TO DEAL WITH API KEYS FOR REAL: set them equal to environment variables in the terminal.
	//later, when working with heroku: use herokuConfig (command line interface) to manually set env variables


exports.gameSearcher = function(gameName){
	//Queries the Giant Bomb games API.
	//Returns an array of the top 5 search results, which are JSON objects

	var apikey = apiKeys.giantBombKey; //for dev/testing only.
	var baseUrl = "http://www.giantbomb.com/api";
	var gamesSearchUrl = baseUrl + '/search/?api_key=' + apikey + '&format=json';
	var requestBody = {
		uri: gamesSearchUrl+'&query='+encodeURI(gameName),
		json: true
	}
	return request
		.get(requestBody)
		.then(function(games) {
			return games.results.slice(0,6);
		})
		.catch(function(err){
			console.log('The games API failed to GET: ', err);
		})
}


exports.bookSearcher = function(bookName){
	//Queries the Google Books API, returns a json object for the closest matching book
	//NOTE: we have an API key, but this query does not require it

	var formattedName = bookName.split(' ').join('+');
	var baseUrl = 'https://www.googleapis.com/books/v1/volumes';
	var bookSearchUrl = baseUrl + '?q=' + formattedName + '&format=json';
	var requestBody = {
		uri: bookSearchUrl,
		json: true
	}	

	return request
		.get(requestBody)
		.then(function(books) {
			//TODO: grab a larger image than the provided thumbnails.
					//how: change the "zoom" parameter on the "thumbnail" url to 0, not 1
			return books.items[0].volumeInfo;
		})
		.catch(function(err){
			console.log('The books API failed to GET: ', err);
		})
}


exports.movieSearcher = function(movieName){
	//Queries the OMDB movies API (provided by IMDB) and returns a JSON object for the closest result
	//NOTE: does not require an api key

	var baseUrl = "http://www.omdbapi.com/";
	var formattedName = movieName.split(' ').join('+');
	var requestBody = {
		uri: baseUrl+'?t='+formattedName+'&y='+'&plot=short&r=json',
		json: true
	}

	return request
		.get(requestBody)
		.then(function(movie) {
			if (movie.response='false'){
				throw {
					errorMessage: "IMDB could not find that movie!"
				}
			} else {
				return movie;
			}
		})
		.catch(function(err){
			console.log('The movie API failed to GET: ', err);
		})
}





//here is a rabbit.

//     ^oo1^                               
//    ++o1^+o111111+^                      
//   1+^^^ oo^1NNNooo+^+^                  
//   o^^^^^^01+100+^o0110o+                
//   ooo^^^^100oooo1o000NMM1               
//   11^^^^^+00000000000NMMMN1             
//   ^1+^^^^^^100000MM0NMN0NMMM01^         
//    oMo^^^^^ +11+1o0MMNNMMN00NMMM0^      
//     1Mo+^^+^^^^^^^^+0M00MMMMMMNNNM0     
//      oMMN1+^^^^^^+1oNMMNNMMMMMMMMNNM+   
//      ^MN^ ^^^^^^^^^100NNM0NMMMMMMMMNM1  
//      NM^^^^^^^^^^^^^^^^10M+^+1oNMMMNMM  
//      0+^^^^^^^^^^^^^^^^^+oo     +oMM0^  
//      ^^^^^^^^^^^^^^^^^^^^+o       1NM^  
//     1^^^^^^^^^^^^^^^^^^^^^++        +   
//    ^o^^^^^^^^^^^^^^^^^^^^^^^            
//     o^^^^^^^^^^^^^^^^^^^^^^             
//     NN^^^^^^^^^^^^^ ^^^^^^^^            
//    ^MN^^^^^^ ^^^^^ ^^^^^^^^1+           
//    1M+^^^^^^^^^^^^^^^^^^ ++oo+          
//    0+^^^^^^^^^^^^^^^^^^+10000o          
//   0+^^^^^^^^^^^^ ^^^+1o0000000o         
//  0o^^^^^^^^^^^^^^+1o000000000000^       
// 1Mo^^^o0+^++^^^+o000oo00000o0000o^      
// oM0++1o1MNMo^+1o00000000000000000o      
// 0M0001^ 0MMo1000000000000o000ooo001     
//   o1+   1MM00000000000000o000000000^    
//         ^MMN000000000000000000000001    
//          oMMN000000000000000000o0000    
//          ^MMMMMN000000o0000000000000    
//           NMMMN000oo000000000oo000oo    
//          +MMMNN00000oo00000000000o0o    
//          0MMMMN000000000000oo000000o    
//          MMMMM00000000000000000NMMM^    
//          MMMMMN00000000000o00MMMMM01^^  
//          oMMMMMMN00o000000000MMMNo^^^+^ 
//        ^^^^+1NMMMN00000000000MMM0+^^^^11
//   ^1+^^^+o00o0MMMM000000oo00NNMNNo0++^1o
//   ^+^++^+^^      ^+1o000o001+^          
//              ^^^^^^^oo00o0+             
//            +01111+++1+++^^^             


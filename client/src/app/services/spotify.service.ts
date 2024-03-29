import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    //Note: toPromise() is a deprecated function that will be removed in the future.
    //It's possible to do the assignment using lastValueFrom, but we recommend using toPromise() for now as we haven't
    //yet talked about Observables. https://indepth.dev/posts/1287/rxjs-heads-up-topromise-is-being-deprecated
    //return Promise.resolve();
    return lastValueFrom(this.http.get(this.expressBaseUrl + endpoint)). then ((response) => {
      return response;
    }, (err) => {
      return err;
    })
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.

    var encode = encodeURIComponent(resource);
    var endpoint = '/search/' + category + '/' + encode;
    return this.sendRequestToExpress(endpoint).then((data) => {
      var result = [];
      if (category == 'artist') {
        var items = data.artists.items;
      }
      else if(category == 'album') {
        var items = data.albums.items;
      }
      else if(category == 'track') {
        var items = data.tracks.items;
      }
      
      for(var i = 0; i < items.length; i++) {
        if(category == 'artist') {
          result.push(new ArtistData(items[i]));
        }
        else if(category == 'album') {
          result.push(new AlbumData(items[i]));
        }
        else if(category == 'track') {
          result.push(new TrackData(items[i]));
        }
      }
      return result;
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    var endpoint = '/artist/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new ArtistData(data);
    });
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    var endpoint = '/artist-related-artists/' + artistId;
    return this.sendRequestToExpress(endpoint).then((data) => {
      var result = [];
      for( var i = 0; i < data.artists.length; i++) {
        result.push(new ArtistData(data.artists[i]));
      }
      return result;
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    var endpoint = '/artist-top-tracks/' + artistId;
    return this.sendRequestToExpress(endpoint).then((data) => {
      var result = [];
      for( var i = 0; i < data.tracks.length; i++) {
        result.push(new TrackData(data.tracks[i]));
      }
      return result;
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    var endpoint = '/artist-albums/' + artistId;
    return this.sendRequestToExpress(endpoint).then((data) => {
      var result = [];
      for( var i = 0; i < data.items.length; i++) {
        result.push(new AlbumData(data.items[i]));
      }
      return result;
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    var endpoint = '/album/' + albumId;
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    var endpoint = '/album-tracks/' + albumId;
    return this.sendRequestToExpress(endpoint).then((data) => {
      var result = [];
      for( var i = 0; i < data.items.length; i++) {
        result.push(new TrackData(data.items[i]));
      }
      return result;
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    var endpoint = '/track/' + trackId;
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new TrackData(data);
    });
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    var endpoint = '/track-audio-features/' + trackId;
    return this.sendRequestToExpress(endpoint).then((data) => {
      var result = [];
      result.push(new TrackFeature('danceability', data.danceability))
      result.push(new TrackFeature('energy', data.energy));
      result.push(new TrackFeature('speechiness', data.speechiness));
      result.push(new TrackFeature('acousticness', data.acousticness));
      result.push(new TrackFeature('instrumentalness', data.instrumentalness));
      result.push(new TrackFeature('liveness', data.liveness));
      result.push(new TrackFeature('valence', data.valence));
      return result;
    });
  }
}

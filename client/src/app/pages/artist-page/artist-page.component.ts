import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistData } from '../../data/artist-data';
import { TrackData } from '../../data/track-data';
import { AlbumData } from '../../data/album-data';
import { SpotifyService } from 'src/app/services/spotify.service';
import { PredictionEvent } from 'src/app/prediction-event';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css']
})
export class ArtistPageComponent implements OnInit {
  gesture:string;
	artistId:string;
	artist:ArtistData;
	relatedArtists:ArtistData[];
	topTracks:TrackData[];
	albums:AlbumData[];
  k:number = 0;
  toggle:string = "Album";

  constructor(private route: ActivatedRoute, private spotifyService:SpotifyService) { }

  ngOnInit() {
  	this.artistId = this.route.snapshot.paramMap.get('id');
    //TODO: Inject the spotifyService and use it to get the artist data, related artists, top tracks for the artist, and the artist's albums
    this.spotifyService.getArtist(this.artistId).then(data=>{
      this.artist = data;
    });
    this.spotifyService.getRelatedArtists(this.artistId).then(data=>{
      this.relatedArtists = data;
    });
    this.spotifyService.getTopTracksForArtist(this.artistId).then(data=>{
      this.topTracks = data;
    });
    this.spotifyService.getAlbumsForArtist(this.artistId).then(data=>{
      this.albums = data
    });

  }
  prediction(event: PredictionEvent){
    this.gesture = event.getPrediction();
    // localStorage.setItem('gesture', this.gesture);
    if(this.gesture == "Two Open Hands") {
      //window.location.href = 'https://open.spotify.com/user/31by4hs6trtycq5feotdj2jskhrq';
      if(this.artist) {
        window.location.href = this.artist.url;
      }
    }
    else if(this.gesture == "Two Closed Hands") {
      window.location.href = "/"
    }
    else if(this.gesture == "One Open Hand and One Closed Hand") {
      window.location.href = "/track/" + this.topTracks[this.k].id;
    }
    else if(this.gesture == "Two Hands Pointing") {
      this.k++;
      if(this.k > this.topTracks.length-1){
        this.k = 0;
      }
      this.gesture = "Two Hands Pointing - " + (this.k+1);
    }
    else if(this.gesture == "Hand Pointing") {
      this.toggle = "Album";
      console.log(this.toggle);
    }
    else if(this.gesture == "Closed Hand") {
      this.toggle = "Artist";
      console.log(this.toggle);
    }
    if(this.gesture == "Open Hand") {
      console.log(this.toggle);
      if(this.toggle == "Album") {
        var id = document.getElementById("artistAlbumCard");
        window.location.href = id.getAttribute("href");
      }
      else if(this.toggle == "Artist") {
        var id = document.getElementById("similarArtistCard");
        window.location.href = id.getAttribute("href");
      }
    }

  }

}
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { FormControl, Validators } from '@angular/forms';
import { HomePage } from "../home/home";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
    maxResult = '50';
    googleToken = 'AIzaSyCxM04zLQjbOf4OpHmbCsMwpj7cBzMhzmY';
    search = new FormControl('', [Validators.required]);
    posts:any = [];

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public http: Http
    ) {
    }

    searchReq() {
        if (this.search.valid) {
            let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='
                + this.search.value + '&type=video&maxResults='
                + this.maxResult + '&key='
                + this.googleToken;

            this.http.get(url)
            .map(res => res.json())
            .subscribe(data => {
                this.posts = data.items;
            }) 
        }    
    }

    setParam(post) {
        var video = {
            id: post.id.videoId,
            title: post.snippet.title,
            description: post.snippet.description,
            thumbnail: post.snippet.thumbnails.high.url
        }
        this.navCtrl.push(HomePage, { video: video });
    }
}

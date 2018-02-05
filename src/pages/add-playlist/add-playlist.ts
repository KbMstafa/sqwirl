import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormControl, Validators } from '@angular/forms';

import { HomePage } from "../home/home";

@IonicPage()
@Component({
    selector: 'page-add-playlist',
    templateUrl: 'add-playlist.html',
})
export class AddPlaylistPage {
    name = new FormControl('', [Validators.required, Validators.maxLength(15)]);
    description = new FormControl('', [Validators.required]);

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private storage: Storage
        ) { }

    getNameErrorMessage() {
        return this.name.hasError('maxlength') ? 'Playlist name must be at 15 character at most' :
            '';
    }

    add() {
        if (this.name.valid && this.description.valid) {
            this.storage.get('playlists').then((val) => {
                var playlists = [];
                if(val != null) {
                    playlists = playlists.concat(val);
                }
                var key = Date.now().toString();
                playlists.unshift(key);
                this.storage.set('playlists', playlists).then((val) => {
                    var playlist = {
                        key: key,
                        name: this.name.value,
                        description: this.description.value,
                        videos: []
                    };
                    this.storage.set(key, playlist).then((val) => {
                        this.navCtrl.push(HomePage);
                    });
                });
            });
        }
    }

}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { AddPlaylistPage } from '../add-playlist/add-playlist'
import { PlaylistPage } from '../playlist/playlist'
import { SearchPage } from "../search/search";

import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    pushSearch: any;
    pushNewPlaylist: any;
    playlists = [];
    video = null;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        private storage: Storage
        ) {
        this.pushSearch = SearchPage;
        this.pushNewPlaylist = AddPlaylistPage;
        this.storage.get('playlists').then((playlists) => {
            if(playlists) {
                for(var playlist of playlists) {
                    this.storage.get(playlist).then((playlist) => {
                        this.playlists.push(playlist);
                    });
                }
            }
        });
        if(typeof(navParams.get('video')) !== 'undefined') {
            this.video = navParams.get('video');
        }
    }

    showConfirm(key) {
        let confirm = this.alertCtrl.create({
            title: 'Delete playlist?',
            message: 'Do you agree to delete this playlist?',
            buttons: [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.storage.get('playlists').then((playlists) => {
                            var index = playlists.indexOf(key);
                            if (index > -1) {
                                playlists.splice(index, 1);
                            }
                            this.storage.set('playlists', playlists);
                            this.storage.remove(key);
                            this.playlists = this.playlists.filter(function( obj ) {
                                return obj.key !== key;
                            });
                        })
                    }
                }
            ]
        });
        confirm.present();
    }

    addToPlaylist(key) {
        this.storage.get(key).then((playlist) => {
            playlist.videos.unshift(this.video);
            this.video = null;
            this.storage.get('playlists').then((playlists) => {
                var index = playlists.indexOf(key);
                if (index > -1) {
                    playlists.splice(index, 1);
                }
                playlists.unshift(key);
                this.storage.set('playlists', playlists);
                this.playlists = this.playlists.filter(function( obj ) {
                    return obj.key !== key;
                });
            })
            this.storage.remove(key).then(() => {
                this.storage.set(key, playlist).then((val) => {
                    this.playlists.unshift(val);
                });
            });
        });
    }

    pushPlaylist(playlist) {
        this.navCtrl.push(PlaylistPage, { playlist: playlist })
    }
}
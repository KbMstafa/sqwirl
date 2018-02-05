import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
    selector: 'page-playlist',
    templateUrl: 'playlist.html',
})
export class PlaylistPage {
    playlist:any = null;
    edit:boolean = false;
    videos:any = null;
    name = null;
    description = null;

    constructor(
        private storage: Storage,
        public navParams: NavParams,
        public navCtrl: NavController,
        public alertCtrl: AlertController
        ) {
        if(typeof(navParams.get('playlist')) !== 'undefined') {
            this.playlist = navParams.get('playlist');
        }
        this.name = new FormControl(this.playlist.name);
        this.description = new FormControl(this.playlist.description);
    }

    removeVideo(id) {
        this.playlist.videos = this.playlist.videos.filter(function( obj ) {
            return obj.id !== id;
        });
    }

    startEdit() {
        this.edit = !this.edit;
        this.videos = this.playlist.videos;
    }

    confirmEdit() {
        let confirm = this.alertCtrl.create({
            title: 'Confirm edit?',
            message: 'Do you confirm all the edit?',
            buttons: [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.edit = !this.edit;
                        this.playlist.name = this.name.value;
                        this.playlist.description = this.description.value;
                        this.storage.get('playlists').then((playlists) => {
                            var index = playlists.indexOf(this.playlist.key);
                            if (index > -1) {
                                playlists.splice(index, 1);
                            }
                            playlists.unshift(this.playlist.key);
                            this.storage.set('playlists', playlists);
                        });
                        this.storage.remove(this.playlist.key).then(() => {
                            this.storage.set(this.playlist.key, this.playlist);
                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    cancelEdit() {
        this.edit = !this.edit;
        this.playlist.videos = this.videos;
        this.name = new FormControl(this.playlist.name);
        this.description = new FormControl(this.playlist.description);
    }
}

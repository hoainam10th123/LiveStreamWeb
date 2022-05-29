import { makeAutoObservable } from 'mobx';
import Peer from 'peerjs';

export default class PeerStore {
    currentPeer = new Peer();
    currentStream: MediaStream | null = null;
    isLoading = false;

    constructor(){        
        makeAutoObservable(this);
    }

    setPeer = (peer: Peer)=>{
        this.currentPeer = peer;
    }

    get CurrentPeer(){
        return this.currentPeer;
    }

    setStream = (stream: MediaStream | null)=>{
        this.currentStream = stream;
    }

    setLoading = (val: boolean)=>{
        this.isLoading = val;
    }

    destroyPeer = ()=>{
        this.isLoading = true;
        this.currentPeer.destroy();
        this.currentStream = null;
        this.isLoading = false;
    }
}
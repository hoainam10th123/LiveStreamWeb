import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { IUser } from "../models/user";
import { toast } from "react-toastify";
import UserPeer from "../models/userPeer";
import { Group } from "../models/group";
import { messageService } from "./messageService";


export default class PresenceHubStore {
    usersOnline: UserPeer[]  = [];
    hubConnection: HubConnection | null = null;
    group: Group | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (user: IUser) => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_HUB_URL + 'presence', {
                accessTokenFactory: () => user.token!
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection.start().catch(error => console.log('Error establishing the connection: ', error));

        this.hubConnection.on('UserIsOnline', username => {
            runInAction(() => {
                this.usersOnline.push(new UserPeer('', username));
                toast.info(username +' online');
            });            
        })

        this.hubConnection.on('UserIsOffline', username => {
            runInAction(() => {
                this.usersOnline = this.usersOnline.filter(x=>x.username !== username);
                toast.info(username +' offline');
            });            
        })

        this.hubConnection.on('GetOnlineUsers', (users: string[]) => {
            runInAction(() => {
                users.forEach(val=>{
                    const tonTai = this.usersOnline.some(x=>x.username === val);
                    if(!tonTai){
                        this.usersOnline.push(new UserPeer('', val));
                    }                    
                })
            });
        })

        this.hubConnection.on('OnUpdateUserPeer', (user: UserPeer) => {
            runInAction(() =>{
                const index = this.usersOnline.findIndex(x=>x.username === user.username);
                if(index !== -1){//da co thi update lai
                    this.usersOnline[index].id = user.id;
                }else{//chua co
                    this.usersOnline.push(user);
                }
            })            
        })

        this.hubConnection.on('UpdatedGroup', (group: Group) => {
            runInAction(() =>{
                this.group = group;
            })
        })

        this.hubConnection.on('OnUpDateStream', (username: string) => {
            runInAction(() =>{
                messageService.sendMessage(username);
            })
        })

    }

    get UsersOnLine(){
        return this.usersOnline;
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }

    updateUserPeer = async (peerId: string)=>{
        try {
            await this.hubConnection?.invoke('UpdateUserPeer', {id: peerId});
        } catch (error) {
            console.log(error);
        }  
    }
}
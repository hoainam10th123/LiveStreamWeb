import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { IComment } from "../models/comment";
import { store } from "./stores";

export default class MessageHubStore {
    hubConnection: HubConnection | null = null;
    comments: IComment[] = [];

    constructor(){
        makeAutoObservable(this);
    }

    createHubConnection = (roomId: string) => {
        
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_HUB_URL + 'message?roomId=' + roomId, {
                accessTokenFactory: () => store.userStore.user?.token!
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection.start().catch(error => console.log('Error establishing the connection: ', error));

        this.hubConnection.on('OnUserCommentInGroup', (comment: IComment) => {
            runInAction(() => {
                this.comments.push(comment);
            });
        })

/*         this.hubConnection.on('ReceiveComment', (comment: IChatComment) => {
            runInAction(() => {
                comment.createdAt = new Date(comment.createdAt);
                this.comments.unshift(comment)
            });
        }) */
  
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }

    addComment = async (values: any) => {
        try {
            await this.hubConnection?.invoke('SendComment', values);
        } catch (error) {
            console.log(error);
        }
    }

    sendStream = async () => {
        try {
            await this.hubConnection?.invoke('SendLiveStream');
        } catch (error) {
            console.log(error);
        }
    }

    startStream = async () => {
        try {
            await this.hubConnection?.invoke('StartLiveStream');
        } catch (error) {
            console.log(error);
        }
    }
}
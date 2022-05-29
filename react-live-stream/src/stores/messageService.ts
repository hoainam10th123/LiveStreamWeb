import { Subject } from 'rxjs';

const subject = new Subject<string>();

export const messageService = {
    sendMessage: (username: string) => subject.next(username),
    getMessage: () => subject.asObservable()
};
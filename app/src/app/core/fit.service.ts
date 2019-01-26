import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable()
export class UserService {

    public static readonly SESSION_STORAGE_KEY: string = 'accessToken';
    private user: GoogleUser = undefined;

    constructor(private googleAuthService: GoogleAuthService,
        private ngZone: NgZone) {
    }

    public setUser(user: GoogleUser): void {
        this.user = user;
    }

    public getCurrentUser(): GoogleUser {
        return this.user;
    }

    public getToken(): string {

        const token: string = sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);

        if (!token) {
            throw new Error('no token set , authentication required');
        }

        return sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
    }

    public signIn() {
        return new Promise((resolve, reject) => {

            this.googleAuthService.getAuth().subscribe((auth) => {

                auth.signIn().then(res => {
                    this.signInSuccessHandler(res);
                    resolve();

                }, err => {
                    this.signInErrorHandler(err);
                    reject();
                });
            });
        });
    }

    public signOut() {
        return new Promise((resolve, reject) => {

            this.googleAuthService.getAuth().subscribe((auth) => {

                try {
                    auth.signOut();
                } catch (e) {
                    console.error(e);
                    reject();
                }

                sessionStorage.removeItem(UserService.SESSION_STORAGE_KEY);
                this.user = undefined;

                resolve();
            });
        });
    }

    public isUserSignedIn(): boolean {
        const token = sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);

        return token !== null;
    }

    private signInSuccessHandler(res: GoogleUser): void {

        this.ngZone.run(() => {

            this.user = res;
            console.log(res.getAuthResponse());

            sessionStorage.setItem(
                UserService.SESSION_STORAGE_KEY, res.getAuthResponse().access_token
            );
        });
    }

    private signInErrorHandler(err) {
        console.warn(err);
    }
}

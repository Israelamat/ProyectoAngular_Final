export interface Users {
   id?: number;
   name: string;
   email: string;
   avatar: string;
   lat: number;
   lng: number;
   password?: string;
}


export interface UserLogin {
    email: string;
    password: string;
    lat?: number;
    lng?: number;
}


export interface UserProfileEdit {
    name?: string;
    email?: string;
}

export interface UserAvatarEdit {
    avatar?: string;
}

export interface UserPasswordEdit {
    password?: string;
}

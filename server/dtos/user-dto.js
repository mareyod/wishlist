module.exports = class UserDto{
    email;
    id;
    isActivated;
    nickname;
    avatar_url;

    constructor(model){
        this.email = model.email
        this.id = model.id
        this.isActivated = model.is_activated
        this.nickname = model.nickname
        this.avatar_url = model.avatar_url
    }
}
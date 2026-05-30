import { UserDtoInterface, UserEntity} from "../types/user.types";

export default class UserDto implements UserDtoInterface {
    readonly id: number;
    readonly email: string;
    readonly nickname: string;
    readonly avatar_url: string | null;
    readonly isActivated: boolean;

    constructor(model: UserEntity){
        this.email = model.email
        this.id = model.id
        this.isActivated = model.is_activated
        this.nickname = model.nickname
        this.avatar_url = model.avatar_url
    }
}
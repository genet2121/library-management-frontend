import BaseEntity from "./BaseEntity";
import UserRoles from "../Enums/UserRoles";

export default interface User extends BaseEntity {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    Role: UserRoles;
    Status: ("active"|"inactive");
    Password: string;
}

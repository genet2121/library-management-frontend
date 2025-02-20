import NavigationTypes from "../Enums/NavigationTypes";

export default interface INavigation {

    Name: string;
    Icon: any;
    type: NavigationTypes;
    roles: string[];
    active: boolean;
    link?: string;
    action?: (user: any) => Promise<void>;
    validator: (user: any) => Promise<boolean>;

}
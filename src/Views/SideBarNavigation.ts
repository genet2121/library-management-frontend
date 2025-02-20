import NavigationTypes from "../Enums/NavigationTypes";
import UserRoles from "../Enums/UserRoles";
import INavigation from "../Intefaces/INavigation";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const SideBarNavigation: INavigation[] = [
    {
        Name: "Dashboard",
        Icon: DashboardIcon,
        roles: [UserRoles.ADMINISTRATOR, UserRoles.MEMBER, UserRoles.LIBRARIAN],
        type: NavigationTypes.LINK,
        active: true,
        link: "/",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Users",
        Icon: PeopleAltIcon,
        roles: [UserRoles.ADMINISTRATOR],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_user",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    
    {
        Name: "Book",
        Icon: MenuBookIcon,
        roles: [UserRoles.ADMINISTRATOR, UserRoles.MEMBER, UserRoles.LIBRARIAN],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_book",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Member",
        Icon: AccountBoxIcon,
        roles:[UserRoles.ADMINISTRATOR, UserRoles.MEMBER, UserRoles.LIBRARIAN],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_member",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
  
    {
        Name: "Loan",
        Icon: CreditScoreIcon,
        roles: [UserRoles.ADMINISTRATOR, UserRoles.MEMBER, UserRoles.LIBRARIAN],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/tbl_loan",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    
    
    
   

];

export default SideBarNavigation;
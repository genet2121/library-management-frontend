
import FieldTypes from "../Enums/FiedTypes";
import UserRoles from "../Enums/UserRoles";

import IField from "../Intefaces/IField";
import IForm from "../Intefaces/IForm";
import IPagination from "../Intefaces/IPagination";
import Utils from "../Models/Utils";
import LocalData from "../Intefaces/LocalData";
import AuthResult from "../Intefaces/AuthResult";
import AdminAPI from "../APIs/AdminAPI";




const localStatus = [
  {
    value: true,
    label: "Active",
    color: "green",
    bgColor: "rgba(0, 128, 0, 0.298)",
  },
  { value: false, label: "Inactive", color: "#FF1515FF", bgColor: "#FF10106E" },
];



const availableStatus = [
  {
    value: 1,
    label: "Available",
    color: "green",
    bgColor: "rgba(0, 128, 0, 0.298)",
  },
  { value: 0, label: "Loaned", color: "#FF1515FF", bgColor: "#FF10106E" },
];




const uploadImage = async (
  token: string,
  table: string,
  attachment: { file: any; name: string }
): Promise<any> => {
  try {
    let response = await AdminAPI.uploadImage(attachment.file);
    return response;
  } catch (error) {
    return 0;
  }
};

const mapSingle = (fields: IField[], mappings: any, data: any) => {
  let new_fields: IField[] = fields.map((fld) => {
    let mpfunc = mappings[`${fld.id}`];
    if (mpfunc) {
      return {
        ...fld,
        ...mpfunc(data),
      };
    } else {
      return fld;
    }
  });

  return new_fields;
};

const mapValue = async (fields: IField[], token?: string, table?: string) => {
  let new_instance: any = {};

 
  let single_field;
  let charToCheck = /[<>;]/g;

  for (let i = 0; i < fields.length; i++) {
    single_field = fields[i];
    if (
      single_field.value == "" ||
      single_field.value == null ||
      (single_field.type == FieldTypes.NUMBER &&
     
        Number.isNaN(single_field.value))
    ) {
      if (single_field.required) {
        throw new Error(`The field ${single_field.label} is required!`);
      }
    } else {
    

      if (
        single_field.type == FieldTypes.NUMBER
        // || single_field.type == FieldTypes.REFERENCE
      ) {
        new_instance[single_field.id] = Number.isInteger(single_field.value)
          ? parseInt(single_field.value)
          : parseFloat(single_field.value);
      } else if (
        single_field.type == FieldTypes.DATE ||
        single_field.type == FieldTypes.DATETIME
      ) {
        new_instance[single_field.id] = new Date(
          single_field.value
        ).toISOString();
      } else if (single_field.type == FieldTypes.IMAGE) {
        if (!Number.isInteger(single_field.value)) {
          console.log("called once ", single_field.value);
          new_instance[single_field.id] = await uploadImage(
            token ?? "user",
            table ?? "user",
            {
              file: single_field.value.files[0],
              name: "image from input",
            }
          );
        } else {
          new_instance[single_field.id] = single_field.value;
        }
      } else {
        new_instance[single_field.id] = single_field.value;
      }
    }
  }

  return new_instance;
};

const tables: IForm[] = [
  {
    title: "Users",
    id: "tbl_user",
    roles: [UserRoles.ADMINISTRATOR],
    hasAttachment: false,
    realId: "name",
    idColumn: "name",
    actions: [
      {
        roles: [UserRoles.ADMINISTRATOR],
        lable: "Update",
        class: "btn zbtn",
        action: async (token: string, fields: IField[]) => {
          let new_user: any = {};
          let Id!: string;

          fields.forEach((fld) => {
            if (["email","first_name","last_name",  "password", "enabled", "roles"].includes(fld.id)) {
              new_user[fld.id] = fld.value;
            }
            if (fld.id === "_id") {
              Id = fld.value;
            }
          });

          let admin_result = await AdminAPI.update(
            token,
            `library_management.api.update_user`,
            {...new_user,
            roles: new_user.roles
            }
            
          );
          console.log('admin_result', admin_result);
          return admin_result.message;
        },
      },

    ],
    relatedList: [],
    fields: [
      {
        id: "name",
        label: "Identifier",
        type: FieldTypes.TEXT,
        description: "User Id",
        value: "",
        order: 1,
        required: false,
        visible: false,
        readonly: true,
        notOnList: false,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "first_name",
        label: "First Name",
        type: FieldTypes.TEXT,
        description: "first Name",
        value: "",
        order: 10,
        required: true,
        visible: true,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "last_name",
        label: "Last Name",
        type: FieldTypes.TEXT,
        description: "last Name",
        value: "",
        order: 10,
        required: true,
        visible: true,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
    
      {
        id: "email",
        label: "Email Address",
        type: FieldTypes.EMAIL,
        description: "User Email Address",
        value: "",
        order: 20,
        required: false,
        visible: true,
        readonly: false,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "password",
        label: "Password",
        type: FieldTypes.PASSWORD,
        description: "User Password",
        value: "",
        order: 20,
        required: false,
        notOnList: true,
        visible: true,
        readonly: false,
        notFilter: false,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "roles",
        label: "Role ",
        type: FieldTypes.MULTISELECT,
        description: "User Role",
        value: "",
        order: 30,
        required: true,
        visible: true,
        readonly: false,
        
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
     
      {
        id: "user_type",
        label: "UserType ",
        type: FieldTypes.TEXT,
        description: "User Type",
        value: "",
        order: 30,
        required: false,
        visible: false,
        readonly: false,
        
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
     
     
     
      {
        id: "enabled",
        label: "Status",
        type: FieldTypes.SELECT,
        description: "is_active",
        value: "",
        order: 1,
        required: false,
        visible: true,
        notOnList: false,
        readonly: false,
        options: localStatus,
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
   
    ],
 
  

    onsubmit: async (token: string, fields: IField[]): Promise<any> => {
      let new_instance = await mapValue(fields, token, "user");
      new_instance.enabled = 1
      let admin_result = await AdminAPI.createNew(token, "library_management.api.user_register", {
        ...new_instance,
        role: new_instance.roles[0],
      
        roles: undefined,
        // user_type: undefined,
        send_welcome_email: 0
      });
      return admin_result;
    },

    onload: async (
      token: string,
      all_fields: IField[],
      localData: LocalData | any,
      loggedUser: AuthResult | any,
      id?: any
    ): Promise<IField[]> => {
      // let is_admin = loggedUser.Roles.includes(UserRoles.ADMIN);

      if (parseInt(id) <= 0) {
        let mappings = {
          name: (data: any) => ({
            value: "",
            readonly: false,
          }),
          first_name: (data: any) => ({
            value: "",
            readonly: false,
          }),
          last_name: (data: any) => ({
            value: "",
            readonly: false,
          }),
          roles: (data: any) => ({
            value: "",
            options: localData.roles.map((dt: any) => ({
              value: dt.name,
              label: dt.name,
            })),
       
          email: (data: any) => ({
            value: "",
            required: true,
            readonly: false,
          }),
          // user_type: (data: any) => ({
          //   value: "",
          //   Visibility: false,
          //   readonly: false,
          // }),
        
          password: (data: any) => ({
            value: "",
            
            readonly: false,
          }),
        
            
            readonly: false,
          }),
          enabled: (data: any) => ({
            value: true,
            readonly: true,
            required: false,
          }),
        };

        return mapSingle(all_fields, mappings, {});
        // return all_fields.map(fld => {fld.value = ""; return fld;});
      }

      let data = await AdminAPI.getSingle(token, "library_management.api.get_user_by_id", id, "user_id");

      if (data) {
        let mappings = {
          name: (data: any) => ({
            value: data["_id"],
          }),
          first_name: (data: any) => ({
            value: data.first_name,
            readonly: false,
          }),
          last_name: (data: any) => ({
            value: data.last_name,
            readonly: false,
          }),
       
          email: (data: any) => ({
            value: data.email,
            required: true,
            readonly: false,
          }),
          // user_type: (data: any) => ({
          //   value: data.user_type,
          //   // options: localRoles
          // }),
          roles: (data: any) => ({
            value: data.roles,
            options: localData.roles.map((dt: any) => ({
              value: dt.name,
              label: dt.name,
            })),
          }),
          enabled: (data: any) => ({
            value: data.enabled,
            readonly: loggedUser.role == UserRoles.MEMBER,
            required: true,
          }),
        };

        return mapSingle(all_fields, mappings, data);
      }

      return all_fields;
    },

    listLoader: async (
      token: string,
      pageNumber: number,
      pageSize: number,
      localData: LocalData | any,
      condition?: any
    ): Promise<IPagination<any>> => {
      let data: any = await AdminAPI.getAll(
        token,
        "library_management.api.get_users",
        pageNumber,
        pageSize,
        condition,
     
      );
      console.log('data+++++++++++++++++++localData.roles', localData.roles);


      let records = data.Items.map((rec: any) => ({
        ...rec,
        enabled: localStatus.find((rl) => rl.value == rec.enabled) ?? "",
        // roles: rec.roles[0],
        
        roles: localData.roles.find((mbs: any) => mbs.name === rec.roles[0])?.name ?? "",
        
      }));
      

      console.log(records);
      data.Items = records;
      return data;
    },
  },
  {
    title: "Books",
    id: "tbl_book",
    roles: [UserRoles.ADMINISTRATOR, UserRoles.LIBRARIAN],
    
    hasAttachment: false,
    realId: "name",
    idColumn: "name",
    actions: [
      {
        roles: [UserRoles.ADMINISTRATOR],
        lable: "Update",
        class: "btn zbtn",
        action: async (token: string, fields: IField[]) => {
          let new_user: any = {};
          let Id!: string;

          fields.forEach((fld) => {
            if (["name", "title","author","isbn",  "published_date", "number_of_copy"].includes(fld.id)) {
              new_user[fld.id] = fld.value;
            }
            console.log('fld', fld);
            if (fld.id === "name") {
              Id = fld.value;
            }
          });
          new_user.published_date = Utils.convertISOToDate( new_user.published_date)
          console.log('new_user', new_user);
          let admin_result = await AdminAPI.update(
            token,
            `library_management.api.update_book`,
            {...new_user,
              book_id: Id,
              name:undefined
            }
            
          );
          console.log('admin_result', admin_result);
          return admin_result.message;
        },
      },
    
    ],
    relatedList: [],
    fields: [
      {
        id: "name",
        label: "Identifier",
        type: FieldTypes.TEXT,
        description: "book identifier name",
        value: "",
        order: 1,
        required: false,
        visible: false,
        notOnList: false,
        readonly: true,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "title",
        label: "Title",
        type: FieldTypes.TEXT,
        description: " enter is book title",
        value: "",
        order: 10,
        required: true,
        visible: true,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "author",
        label: "Author",
        type: FieldTypes.TEXT,
        description: "enter author",
        value: "",
        order: 10,
        required: true,
        visible: true,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "isbn",
        label: "ISBN",
        type: FieldTypes.TEXT,
        description: " enter book isbn",
        value: "",
        order: 20,
        required: false,
        visible: true,
        readonly: false,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "published_date",
        label: "Published Date",
        type: FieldTypes.DATE,
        description: "enter book published date",
        value: "",
        order: 10,
        required: true,
        visible: true,
        readonly: false,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "number_of_copy",
        label: "Number of Copy",
        type: FieldTypes.NUMBER,
        description: " number_of_copy",
        value: "",
        order: 20,
        required: false,
        visible: true,
        readonly: false,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "is_available",
        label: "Status",
        type: FieldTypes.SELECT,
        description: "is available",
        value: "",
        order: 1,
        required: false,
        visible: true,
        notOnList: false,
        readonly: false,
        options: availableStatus,
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },

     
    ],

    onsubmit: async (token: string, fields: IField[]): Promise<any> => {
      let new_instance = await mapValue(fields, token, "book");
      new_instance.published_date = Utils.convertISOToDate(new_instance.published_date )
      return await AdminAPI.createNew(token, "library_management.api.create_book", new_instance
        
      );
    },

    onload: async (
      token: string,
      all_fields: IField[],
      localData: LocalData | any,
      loggedUser: AuthResult | any,
      id?: any
    ): Promise<IField[]> => {
      // let is_admin = loggedUser.Roles.includes(UserRoles.ADMIN);

      if (parseInt(id) <= 0) {
        let mappings = {
          name: (data: any) => ({
            value: "",
          }),
          title: (data: any) => ({
            value: "",
          }),
          author: (data: any) => ({
            value: "",
          }),
          isbn: (data: any) => ({
            value: "",
          }),
          published_date: (data: any) => ({
            value: "",
          }),
          number_of_copy: (data: any) => ({
            value: "",
          }),
          is_available: (data: any) => ({
            value: "",
          }),
      
         
        };

        return mapSingle(all_fields, mappings, {});
        // return all_fields.map(fld => {fld.value = ""; return fld;});
      }

      let data = await AdminAPI.getSingle(
        token,
        `/library_management.api.get_book_by_id`,
        id,
        "book_id"
      );
      if (data) {
        let mappings = {
          name: (data: any) => ({
            value: data.name,
          }),
          title: (data: any) => ({
            value: data.title,
            required: false,
          }),
          author: (data: any) => ({
            value: data.author,
            required: false,
          }),
          isbn: (data: any) => ({
            value: data.isbn,
            required: false,
          }),
          published_date: (data: any) => ({
            value: data.published_date,
            required: false,
          }),
          number_of_copy: (data: any) => ({
            value: data.number_of_copy,
            required: false,
          }),
          is_available: (data: any) => ({
            value: data.is_available,
            required: false,
          }),
         

         
        };

        return mapSingle(all_fields, mappings, data);
      }

      return all_fields;
    },

    listLoader: async (
      token: string,
      pageNumber: number,
      pageSize: number,
      localData: LocalData | any,
      condition?: any
    ): Promise<IPagination<any>> => {
      let data: any = await AdminAPI.getAll(
        token,
        "library_management.api.get_books",
        pageNumber,
        pageSize,
        condition,
       
      );

      // let records = data.map((rec: any) => ({
      //   id: rec.name, 
      //   ...rec,
      // }));
      let records = data.Items.map((rec: any) => ({
        ...rec,
          id: rec.name, 
        is_available: availableStatus.find((rl) => rl.value == rec.is_available) ?? "",
      }));
      

      console.log("adada", data);
      data.Items = records;
      
      return data;
    },
  },
  {
    title: "Memebers",
    id: "tbl_member",
    roles: [UserRoles.ADMINISTRATOR, UserRoles.LIBRARIAN],
    
    hasAttachment: false,
    realId: "name",
    idColumn: "name",
    actions: [
      {
        roles: [UserRoles.ADMINISTRATOR],
        lable: "Update",
        class: "btn zbtn",
        action: async (token: string, fields: IField[]) => {
          let new_user: any = {};
          let Id!: string;

          fields.forEach((fld) => {
            if (["name", "membership_name","membership_id","email",  "phone"].includes(fld.id)) {
              new_user[fld.id] = fld.value;
            }
            console.log('fld', fld);
            if (fld.id === "name") {
              Id = fld.value;
            }
          });
          
          let admin_result = await AdminAPI.update(
            token,
            `library_management.api.update_member`,
            {...new_user,
              member_id: Id,
              name:undefined
            }
            
          );
          console.log('admin_result', admin_result);
          return admin_result.message;
        },
      },
    ],
    relatedList: [],
    fields: [
      {
        id: "name",
        label: "Identifier",
        type: FieldTypes.TEXT,
        description: "Membership identifier",
        value: "",
        order: 1,
        required: false,
        visible: false,
        notOnList: false,
        readonly: true,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "membership_name",
        label: "Member Ship Name",
        type: FieldTypes.TEXT,
        description: " enter is membership_name",
        value: "",
        order: 10,
        required: true,
        visible: true,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "membership_id",
        label: "Membership Id",
        type: FieldTypes.TEXT,
        description: "enter membership_id",
        value: "",
        order: 10,
        required: true,
        visible: true,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "email",
        label: "Email",
        type: FieldTypes.EMAIL,
        description: " enter email",
        value: "",
        order: 20,
        required: false,
        visible: true,
        readonly: false,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "phone",
        label: "Phone Number",
        type: FieldTypes.TEXT,
        description: "enter phone",
        value: "",
        order: 10,
        required: true,
        visible: true,
        readonly: false,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },

     
    ],

    onsubmit: async (token: string, fields: IField[]): Promise<any> => {
      let new_instance = await mapValue(fields, token, "member");
      return await AdminAPI.createNew(token, "library_management.api.create_member", new_instance);
    },

    onload: async (
      token: string,
      all_fields: IField[],
      localData: LocalData | any,
      loggedUser: AuthResult | any,
      id?: any
    ): Promise<IField[]> => {
      // let is_admin = loggedUser.Roles.includes(UserRoles.ADMIN);
   
      if (parseInt(id) <= 0) {
        let mappings = {
          name: (data: any) => ({
            value: "",
          }),
          membership_name: (data: any) => ({
            value: "",
          }),
          membership_id: (data: any) => ({
            value: "",
          }),
          email: (data: any) => ({
            value: "",
          }),
          phone: (data: any) => ({
            value: "",
          }),
         
        };

        return mapSingle(all_fields, mappings, {});
        // return all_fields.map(fld => {fld.value = ""; return fld;});
      }

      let data = await AdminAPI.getSingle(
        token,
        `library_management.api.get_member_by_id`,
        id,
       "member_id"
      );
      if (data) {
        let mappings = {
          name: (data: any) => ({
            value: data.name,
          }),
          membership_name: (data: any) => ({
            value: data.membership_name,
            required: false,
          }),
          membership_id: (data: any) => ({
            value: data.membership_id,
            required: false,
          }),
          email: (data: any) => ({
            value: data.email,
            required: false,
          }),
          phone: (data: any) => ({
            value: data.phone,
            required: false,
          }),

         
        };

        return mapSingle(all_fields, mappings, data);
      }

      return all_fields;
    },

    listLoader: async (
      token: string,
      pageNumber: number,
      pageSize: number,
      localData: LocalData | any,
      condition?: any
    ): Promise<IPagination<any>> => {
      let data: any = await AdminAPI.getAll(
        token,
        "library_management.api.get_members",
        pageNumber,
        pageSize,
        condition,
       
      );

      let records = data.Items.map((rec: any) => ({
        id: rec.name, 
        ...rec,
      }));
      

      console.log("adada", data);
      data.Items = records;
      
      return data;
    },
  },
  {
    title: "Loans",
    id: "tbl_loan",
    roles: [UserRoles.ADMINISTRATOR],
    hasAttachment: false,
    realId: "name",
    idColumn: "name",
    actions: [
      {
        roles: [UserRoles.ADMINISTRATOR],
        lable: "Update",
        class: "btn zbtn",
        action: async (token: string, fields: IField[]) => {
          let new_user: any = {};
          let Id!: string;

          fields.forEach((fld) => {
            if (["name", "member","book","loan_date",  "return_date"].includes(fld.id)) {
              new_user[fld.id] = fld.value;
            }
            console.log('fld', fld);
            if (fld.id === "name") {
              Id = fld.value;
            }
          });
          new_user.return_date = Utils.convertISOToDate( new_user.return_date)
          new_user.loan_date = Utils.convertISOToDate( new_user.loan_date)
         
          console.log('new_user', new_user);
          let admin_result = await AdminAPI.update(
            token,
            `library_management.api.update_loan`,
            {...new_user,
              loan_id: Id,
              name:undefined,
              book:undefined,
              member:undefined,
              loan_date:undefined
            }
            
          );
          console.log('admin_result', admin_result);
          return admin_result.message;
        },
      },
      {
        roles: [UserRoles.ADMINISTRATOR],
        lable: "Returned",
        class: "btn-secondary shadow-sm",
        action: async (token: string, fields: IField[]) => {
          let new_user: any = {};
          let Id!: string;

          fields.forEach((fld) => {
            if (["name" ].includes(fld.id)) {
              new_user[fld.id] = fld.value;
            }
            console.log('fld', fld);
            if (fld.id === "name") {
              Id = fld.value;
            }
          });
        //   {
        //     "book": "gcssudeqq7",
        //     "is_available": 1
        // }
                    
         
          console.log('new_user', new_user);
          let admin_result = await AdminAPI.createNew(
            token,
            `library_management.api.return_book`,
            {
              loan_id: Id,
             
            }
            
          );
          console.log('admin_result', admin_result);
          return admin_result.message;
        },
      },
    ],
    relatedList: [],
    fields: [
      {
        id: "name",
        label: "Identifier",
        type: FieldTypes.TEXT,
        description: "loan identifier",
        value: "",
        order: 1,
        required: false,
        visible: false,
        notOnList: false,
        readonly: true,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "member",
        label: "Member Name",
        type: FieldTypes.REFERENCE,
        description: " enter ",
        value: "",
        order: 10,
        required: true,
        visible: true,
        references: "tbl_member",
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "book",
        label: "book",
        type: FieldTypes.REFERENCE,
        description: "enter book",
        value: "",
        order: 10,
        required: true,
        visible: true,
        references: "tbl_book",
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "loan_date",
        label: "Loan Date",
        type: FieldTypes.DATE,
        description: " enter loan date",
        value: "",
        order: 20,
        required: false,
        visible: true,
        readonly: false,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },
      {
        id: "return_date",
        label: "Return Date",
        type: FieldTypes.DATE,
        description: "enter return_date",
        value: "",
        order: 10,
        required: true,
        visible: true,
        readonly: false,
        // options?: { value: string, label: string }[];
        onchange: async (
          token: string,
          fields: IField[],
          value: any,
          set_field: (index: number, value: IField) => void
        ): Promise<any> => {
          return value;
        },
      },

     
    ],

    onsubmit: async (token: string, fields: IField[]): Promise<any> => {
      let new_instance = await mapValue(fields, token, "member");
      new_instance.loan_date = Utils.convertISOToDate(new_instance.loan_date)
      new_instance.return_date = Utils.convertISOToDate(new_instance.return_date)
      return await AdminAPI.createNew(token, "library_management.api.create_loan", new_instance);
    },

    onload: async (
      token: string,
      all_fields: IField[],
      localData: LocalData | any,
      loggedUser: AuthResult | any,
      id?: any
    ): Promise<IField[]> => {
      // let is_admin = loggedUser.Roles.includes(UserRoles.ADMIN);
   
      if (parseInt(id) <= 0) {
        let mappings = {
          name: (data: any) => ({
            value: "",
          }),
          member: (data: any) => ({
            value: "",
            options: localData.members.map((dt: any) => ({
              value: dt.name,
              label: dt.membership_name,
            })),
          }),
          book: (data: any) => ({
            value: "",
            options: localData.books.map((dt: any) => ({
              value: dt.name,
              label: dt.title,
            })),
          }),
          loan_date: (data: any) => ({
            value: "",
          }),
          return_date: (data: any) => ({
            value: "",
          }),
         
        };

        return mapSingle(all_fields, mappings, {});
        // return all_fields.map(fld => {fld.value = ""; return fld;});
      }

      let data = await AdminAPI.getSingle(
        token,
        `library_management.api.get_loan_by_id`,
        id,
       "loan_id"
      );
      if (data) {
        let mappings = {
          name: (data: any) => ({
            value: data.name,
          }),
          member: (data: any) => ({
            value: data.member,
            required: false,
            options: localData.members.map((dt: any) => ({
              value: dt.name,
              label: dt.membership_name,
            })),
          }),
          book: (data: any) => ({
            value: data.book,
            required: false,
            options: localData.books.map((dt: any) => ({
              value: dt.name,
              label: dt.title,
            })),
          }),
          loan_date: (data: any) => ({
            value: data.loan_date,
            required: false,
            
          }),
          return_date: (data: any) => ({
            value: data.return_date,
            required: false,
          }),

         
        };

        return mapSingle(all_fields, mappings, data);
      }

      return all_fields;
    },

    listLoader: async (
      token: string,
      pageNumber: number,
      pageSize: number,
      localData: LocalData | any,
      condition?: any
    ): Promise<IPagination<any>> => {
      let data: any = await AdminAPI.getAll(
        token,
        "library_management.api.get_loans",
        pageNumber,
        pageSize,
        condition,
       
      );
      console.log("genet", localData.members);
      let records = data.Items.map((rec: any) => ({
        id: rec.name, 
        ...rec,
        member: localData.members.find((mbs: any) => (mbs.name == rec.member)).membership_name,
        book: localData.books.find((mbs: any) => (mbs.name == rec.book)).title,
      }));
      

      
      data.Items = records;
      
      return data;
    },
  },

  
];

export default tables;

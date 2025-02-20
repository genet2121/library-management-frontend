export default interface AuthResult {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: string;
    first_account: boolean;
    is_active: boolean;
    is_default_password: boolean;
    is_password_changed: boolean;
    is_email_or_phone_number_changed: boolean;
    createdAt: string;
    updatedAt: string;
    id: string;
}
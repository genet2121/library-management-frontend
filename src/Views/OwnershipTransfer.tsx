
import React, { useContext, useEffect, useState } from "react";
import UserRoles from "../Enums/UserRoles"; 
import AuthContext from "../Contexts/AuthContext";
import AdminAPI from "../APIs/AdminAPI";
import AlertContext from "../Contexts/AlertContext";

function OwnershipTransferPage() {
    const { cookies } = useContext(AuthContext);
    const { loggedUser, authWaiting, removeCookie } = useContext(AuthContext);

    const [administrators, setAdministrators] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedAdmin, setSelectedAdmin] = useState("");
    const { setAlert } = useContext(AlertContext);

    useEffect(() => {
        const fetchAdministrators = async () => {
            try {
               
                const result = await AdminAPI.getAllwithoutPagination(cookies.login_token, 'v1/admin');
                
                const eligibleAdmins = result.Items.filter((admin: any) => 
                    admin.role === UserRoles.ADMINISTRATOR || admin.role === UserRoles.LIBRARIAN
                );
                
                setAdministrators(eligibleAdmins);
            } catch (error) {
                console.log("Error fetching administrators:", error);
            }
        };

        fetchAdministrators();
    }, [cookies.login_token]);

    const handleRoleChange = (e: React.ChangeEvent<any>) => {
        setSelectedRole(e.target.value);
    };

    const handleAdminChange = (e: React.ChangeEvent<any>) => {
        setSelectedAdmin(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<any>) => {
        e.preventDefault();

        if (!selectedRole || !selectedAdmin) {
            return;
        }

        const transferUrl = `v1/admin/${selectedAdmin}/transfer`;

        const ownershipTransferData = {
            new_role: selectedRole,
        };

        try {
            const response = await AdminAPI.update(cookies.login_token, transferUrl, ownershipTransferData);
            setAlert(response.message, "success");
            await removeCookie("login_token");
            setTimeout(() => {
                window.location.href = window.location.origin;
            }, 500);
        } catch (error: any) {
            setAlert(error.message, "error");
        }
    };

    return (
        <div className="d-flex justify-content-center w-100 pt-4">
            <div className="card text-center w-75 d-flex justify-center zpanel">
                <div className="card-header" style={{backgroundColor: "rgba(125, 125, 125, 0.074)"}}>
                    <h5>Transfer Ownership</h5>
                </div>
                <form className="mb-3 mt-5" onSubmit={handleSubmit}>
                    <div className="row px-4">
                        <div className="col">
                            <label className="form-label">New Role</label>
                            <select 
                                className="form-control form-control-lg zinput" 
                                value={selectedRole}
                                onChange={handleRoleChange}
                                required
                            >
                                <option value="">Select</option>
                                <option value={UserRoles.ADMINISTRATOR}>Administrator</option>
                                <option value={UserRoles.LIBRARIAN}>Super-admin</option>
                            </select>
                        </div>
                        <div className="col">
                            <label className="form-label">New Owner</label>
                            <select
                                className="form-control form-control-lg zinput"
                                value={selectedAdmin}
                                onChange={handleAdminChange}
                                required
                            >
                                <option value="">Select</option>
                                {administrators.map((admin: any) => (
                                    <option key={admin._id} value={admin._id}>
                                        {admin.first_name} 
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end p-4">
                        <button type="submit" className="btn zbtn mb-2 w-25">Transfer</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OwnershipTransferPage;

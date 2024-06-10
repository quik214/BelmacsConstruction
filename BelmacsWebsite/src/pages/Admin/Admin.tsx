import React from 'react'
import './Admin.css'

import AdminLogin from '../../components/Admin/AdminLogin/AdminLogin'
import AuthDetails from '../../components/Admin/AuthDetails'

export default function Admin() {
    return (
        <div className="admin-ctr">
            <AdminLogin />
            <AuthDetails />
        </div>
    )
}
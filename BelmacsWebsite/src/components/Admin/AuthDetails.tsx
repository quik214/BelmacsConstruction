import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';

const AuthDetails: React.FC = () => {
    const [authUser, setAuthUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user);
            } else {
                setAuthUser(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleSignOut = () => {
        firebaseSignOut(auth).then(() => {
            console.log('Sign out successful');
        }).catch((error: any) => {
            console.log(error);
        });
    };

    return (
        <div>
            {authUser ? (
                <>
                    <p>{`Signed in as ${authUser.email}`}</p>
                    <button onClick={handleSignOut}>Sign Out</button>
                </>
            ) : (
                <p>Signed Out</p>
            )}
        </div>
    );
};

export default AuthDetails;

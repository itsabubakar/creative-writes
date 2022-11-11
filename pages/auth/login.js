import { FcGoogle } from 'react-icons/fc'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../utils/firebase'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'

import { useEffect, useState } from 'react'

export default function Login() {
    const route = useRouter()
    const [user, loading] = useAuthState(auth)

    // Google sign in
    const googleProvider = new GoogleAuthProvider()
    const GoogleLogin = async () => {
        try {
            const results = await signInWithPopup(auth, googleProvider)
            route.push("/")
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (user) {
            route.push('/')
        } else {
            console.log('Login')
        }
    }, [user])

    return (
        <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
            <h2 className="text-2xl font-medium">Join Today</h2>
            <div className="py-4">
                <h3 className="py-4">Sign in with one of the providers</h3>
                <button
                    onClick={GoogleLogin}
                    className="text-white bg-blue-400 w-full font-medium rounded-lg p-4 flex align-middle gap-2">
                    <FcGoogle className='text-2xl' />
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}
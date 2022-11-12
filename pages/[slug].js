import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { auth, db } from "../utils/firebase"
import { toast } from 'react-toastify'
import Message from "../components/Message"
import { arrayUnion, Timestamp, updateDoc, doc, getDoc, onSnapshot } from "firebase/firestore"



export default function Details() {
    const router = useRouter()
    const routeData = router.query
    const [message, setMessage] = useState('')
    const [allMessages, setAllMessages] = useState([])

    const submitMessage = async () => {
        if (!auth.currentUser) return router.push('/auth/login')
        if (!message) {
            toast.error('No empty messages')
            return
        }
        const docRef = doc(db, 'posts', routeData.id)
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                username: auth.currentUser.displayName,
                time: Timestamp.now()
            }),
        })
        setMessage("")
    }

    // get comments
    const getComments = async () => {
        const docRef = doc(db, 'posts', routeData.id)
        const docSnap = await getDoc(docRef)
        const unsubscribe = onSnapshot(docRef, (snapshot => {
            setAllMessages(snapshot.data().comments)
        }))
        return unsubscribe
    }

    useEffect(() => {
        if (!router.isReady) return
        getComments()
    }, [router.isReady])

    return (
        <div>
            <Message {...routeData}>
                <div>
                    <div className="flex">
                        <input
                            onChange={(e) => setMessage(e.target.value)}
                            type="text" value={message} placeholder="Send a message"
                            className="bg-gray-800 w-full text-white text-sm p-2 outline-none"
                        />
                        <button
                            onClick={submitMessage}
                            className="bg-cyan-500 text-white py-2 px-4 text-sm">Submit</button>
                    </div>
                    <div className="py-6">
                        <h2 className="font-semibold">Comments</h2>
                        {allMessages?.map(message => (
                            <div className="p-4 my-4 border-2 " key={message.time}>
                                <div className="flex gap-4 items-center mb-4">
                                    <img src={message.avatar} className="rounded-full w-10" />
                                    <h2>{message.username}</h2>
                                </div>
                                <p className="ml-4">{message.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Message>
        </div>
    )
}
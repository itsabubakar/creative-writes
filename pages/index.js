import Head from 'next/head'
import { useEffect, useState } from 'react'
import { db } from '../utils/firebase'

import Message from '../components/Message'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import Link from 'next/link'

export default function Home() {
  const [allPost, setAllPost] = useState([])

  const getPost = async () => {
    const collectionRef = collection(db, 'posts')
    const q = query(collectionRef, orderBy('timestamp', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPost(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })
    return unsubscribe
  }

  useEffect(() => {
    getPost()
  }, [])

  return (
    <div>
      <div className='my-12 text-lg font-medium'>
        <h2 className=''>See what other people are saying</h2>
        {allPost.map((post) => (
          <Message key={post.id} {...post}>
            <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
              <button>{post.comments?.length > 0 ? post.comments.length : 0} comments</button>
            </Link>
          </Message>
        ))}
      </div>
    </div>
  )
}

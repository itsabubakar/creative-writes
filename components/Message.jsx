export default function Message({ children, avatar, username, description }) {
    return (
        <div className="bg-white p-8 border-b-2 rounded-lg">
            <div className="flex items-center">
                <img src={avatar} className="w-10 rounded-full" />
                <h2 className="ml-2">{username}</h2>
            </div>

            <div className="py-4">
                <p className="break-words">{description}
                </p>
            </div>
            {children}
        </div>
    )
}
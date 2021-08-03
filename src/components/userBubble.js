export default function UserBubble({ username }) {
    return (
        <div className = "unselectable" style={{
            padding: "13px", background: "#F5F9FF",
            borderRadius: "100%",
            width: "8px", height: "8px",
            display: "flex", alignItems: "center",
            fontSize: "0.8em"

        }}>
            {username.charAt(0).toUpperCase()}
        </div>
    )
}
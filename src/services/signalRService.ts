import * as signalR from "@microsoft/signalr";
import axiosInstance from "../../axiosConfig";
import Cookies from "js-cookie";

const API_URL = axiosInstance.defaults.baseURL?.toString().replace('/api/', '');
const HUB_URL = API_URL + "/notificationHub";

const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
        accessTokenFactory: () => {
            const token = Cookies.get("accessToken");
            if (!token) {
                throw new Error('JWT token is missing');
            }
            return token;
        },
        skipNegotiation: true,
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build();

const resetSubscriptions = () => {
    connection.off("ReceiveNotification");
};

const startConnection = async () => {
    if (connection.state === signalR.HubConnectionState.Disconnected) {
        try {
            await connection.start();
            console.log("✅ SignalR connected");
        } catch (err) {
            console.error("❌ SignalR error:", err);
            setTimeout(startConnection, 5000);
        }
    } else {
        console.log("Connection state:", connection.state);
    }
};

connection.onclose(() => {
    console.warn("🔴 SignalR disconnected, reconnecting...");
    resetSubscriptions();
    setTimeout(startConnection, 5000);
});

const stopConnection = async () => {
    if (connection.state !== signalR.HubConnectionState.Disconnected) {
        try {
            resetSubscriptions();
            await connection.stop();
            console.log("✅ SignalR stopped and subscriptions cleared");
        } catch (err) {
            console.error("❌ Error stopping SignalR:", err);
        }
    }
};

export { connection, startConnection, stopConnection };
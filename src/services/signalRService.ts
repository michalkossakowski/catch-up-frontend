
// Mock implementation of the SignalR service

const mockConnection = {
    on: (event: string, callback: (...args: any[]) => void) => {
        console.log(`Mock SignalR: Subscribed to event '${event}'`);
        // You can simulate receiving messages here if needed
        // For example, to test notification handling:
        // if (event === "ReceiveNotification") {
        //     setInterval(() => {
        //         callback({ message: "This is a mock notification!" });
        //     }, 10000);
        // }
    },
    off: (event: string) => {
        console.log(`Mock SignalR: Unsubscribed from event '${event}'`);
    },
    start: () => {
        console.log("Mock SignalR: Connection started");
        return Promise.resolve();
    },
    stop: () => {
        console.log("Mock SignalR: Connection stopped");
        return Promise.resolve();
    },
    onclose: (callback: (error?: Error) => void) => {
        console.log("Mock SignalR: onclose registered");
    },
    state: "Disconnected", // Initial state
};

const startConnection = async () => {
    if (mockConnection.state === "Disconnected") {
        try {
            await mockConnection.start();
            mockConnection.state = "Connected";
            console.log("✅ Mock SignalR connected");
        } catch (err) {
            console.error("❌ Mock SignalR error:", err);
        }
    }
};

const stopConnection = async () => {
    if (mockConnection.state !== "Disconnected") {
        try {
            await mockConnection.stop();
            mockConnection.state = "Disconnected";
            console.log("✅ Mock SignalR stopped");
        } catch (err) {
            console.error("❌ Error stopping Mock SignalR:", err);
        }
    }
};

// Export the mocked objects and functions
export { mockConnection as connection, startConnection, stopConnection };

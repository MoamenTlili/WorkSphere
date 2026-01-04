import Notification from "../models/Notification.js";

/* Get User Notifications */
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; 
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

/* Mark Notifications as Read */
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: "Notification marked as read" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

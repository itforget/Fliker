import axios from "axios";

export async function fetchNotifications(userId: number) {
    try {
      const response = await axios.get(`/api/notifications?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  }

 export async function markNotificationAsRead(notificationId: number) {
    await axios.patch("/api/notifications", { notificationId }, {
      headers: { "Content-Type": "application/json" }
    });
  }

  export async function deleteReadNotifications() {
    await axios.delete("/api/notifications");
  }
export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  balance: number;
}

export interface Transaction {
  id: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverUsername: string;
  receiverAvatar: string;
  amount: number;
  note: string;
  date: string;
  status: "completed" | "pending" | "flagged";
}

export const currentUser: User = {
  id: "u1",
  fullName: "Alex Johnson",
  username: "alexj",
  email: "alex@example.com",
  avatar: "",
  balance: 1247.83,
};

export const users: User[] = [
  currentUser,
  { id: "u2", fullName: "Sarah Chen", username: "sarahc", email: "sarah@example.com", avatar: "", balance: 890.50 },
  { id: "u3", fullName: "Marcus Williams", username: "marcusw", email: "marcus@example.com", avatar: "", balance: 2150.00 },
  { id: "u4", fullName: "Emily Rodriguez", username: "emilyr", email: "emily@example.com", avatar: "", balance: 430.25 },
  { id: "u5", fullName: "David Kim", username: "davidk", email: "david@example.com", avatar: "", balance: 1560.00 },
  { id: "u6", fullName: "Lisa Patel", username: "lisap", email: "lisa@example.com", avatar: "", balance: 675.90 },
];

export const transactions: Transaction[] = [
  {
    id: "t1", senderId: "u2", senderName: "Sarah Chen", senderUsername: "sarahc", senderAvatar: "",
    receiverId: "u1", receiverName: "Alex Johnson", receiverUsername: "alexj", receiverAvatar: "",
    amount: 45.00, note: "Dinner last night 🍕", date: "2026-03-23T14:30:00", status: "completed",
  },
  {
    id: "t2", senderId: "u1", senderName: "Alex Johnson", senderUsername: "alexj", senderAvatar: "",
    receiverId: "u3", receiverName: "Marcus Williams", receiverUsername: "marcusw", receiverAvatar: "",
    amount: 120.00, note: "Concert tickets 🎵", date: "2026-03-22T10:15:00", status: "completed",
  },
  {
    id: "t3", senderId: "u4", senderName: "Emily Rodriguez", senderUsername: "emilyr", senderAvatar: "",
    receiverId: "u1", receiverName: "Alex Johnson", receiverUsername: "alexj", receiverAvatar: "",
    amount: 32.50, note: "Coffee and snacks ☕", date: "2026-03-21T16:45:00", status: "completed",
  },
  {
    id: "t4", senderId: "u1", senderName: "Alex Johnson", senderUsername: "alexj", senderAvatar: "",
    receiverId: "u5", receiverName: "David Kim", receiverUsername: "davidk", receiverAvatar: "",
    amount: 250.00, note: "Rent split for March 🏠", date: "2026-03-20T09:00:00", status: "pending",
  },
  {
    id: "t5", senderId: "u6", senderName: "Lisa Patel", senderUsername: "lisap", senderAvatar: "",
    receiverId: "u1", receiverName: "Alex Johnson", receiverUsername: "alexj", receiverAvatar: "",
    amount: 500.00, note: "Freelance project payment", date: "2026-03-19T11:30:00", status: "flagged",
  },
  {
    id: "t6", senderId: "u1", senderName: "Alex Johnson", senderUsername: "alexj", senderAvatar: "",
    receiverId: "u2", receiverName: "Sarah Chen", receiverUsername: "sarahc", receiverAvatar: "",
    amount: 18.75, note: "Uber ride 🚗", date: "2026-03-18T22:10:00", status: "completed",
  },
  {
    id: "t7", senderId: "u3", senderName: "Marcus Williams", senderUsername: "marcusw", senderAvatar: "",
    receiverId: "u1", receiverName: "Alex Johnson", receiverUsername: "alexj", receiverAvatar: "",
    amount: 75.00, note: "Basketball game bet 🏀", date: "2026-03-17T20:00:00", status: "completed",
  },
  {
    id: "t8", senderId: "u1", senderName: "Alex Johnson", senderUsername: "alexj", senderAvatar: "",
    receiverId: "u4", receiverName: "Emily Rodriguez", receiverUsername: "emilyr", receiverAvatar: "",
    amount: 64.00, note: "Groceries 🛒", date: "2026-03-16T13:20:00", status: "completed",
  },
];


export const updateUnreadCounts = async (conversation, senderId,message) => {
  
    await conversation.set({
        lastMessageAt: date.now(),
        lastMessage: message,
        seendBy: [],
        

    });
    const unreadCounts = conversation.unreadCounts || new Map();
    conversation.participants.forEach(participant => {
        if (participant.userId.toString() !== senderId.toString()) {
            const currentCount = unreadCounts.get(participant.userId.toString()) || 0;
            unreadCounts.set(participant.userId.toString(), currentCount + 1);
        }else{
            unreadCounts.set(participant.userId.toString(), 0);
        }
    });
}
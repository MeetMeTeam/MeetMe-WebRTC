const FriendInvitation = require("../../models/friendInvitation");
const User = require("../../models/user");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;

    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return res.status(401).send("Error occured. Please try again");
    }

    const { senderId, receiverId } = invitation;

    // add friends to both users
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    await senderUser.save();
    await receiverUser.save();

    // delete invitation
    await FriendInvitation.findByIdAndDelete(id);

    // update list of the friends if the users are online
    // เป็นการไป get friend list ที่ฟ้อน วน สองบรรทัดนีัเว้นไว้ก่อน
    friendsUpdates.updateFriends(senderId.toString());
    friendsUpdates.updateFriends(receiverId.toString());

    // update list of friends pending invitations
    // แก้ friend invite list ที่ฟ้อน
    friendsUpdates.updateFriendsPendingInvitations(receiverId.toString());
    console.log("add friend already")
    return res.status(200).send("Friend successfuly added");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = postAccept;

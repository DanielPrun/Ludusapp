const Follow = require("../models/follow");

const followUserIds = async (identityUserId) => {
    try {
        let seguint = await Follow.find({ "user": identityUserId })
            .select({ "followed": 1, "_id": 0 })
            .exec();

        let seguidors = await Follow.find({ "followed": identityUserId })
            .select({ "user": 1, "_id": 0 })
            .exec();

        let seguintNet = [];

        seguint.forEach(follow => {
            seguintNet.push(follow.followed);
        });

        let seguidorsNet = [];

        seguidors.forEach(follow => {
            seguidorsNet.push(follow.user);
        });

        return {
            seguint: seguintNet,
            seguidors: seguidorsNet
        }

    } catch (error) {
        return {};
    }
}

const followThisUser = async (identityUserId, profileUserId) => {
    
    let seguint = await Follow.findOne({ "user": identityUserId, "followed": profileUserId });
    let seguidor = await Follow.findOne({ "user": profileUserId, "followed": identityUserId });

    return {
        seguint,
        seguidor
    };
}

module.exports = {
    followUserIds,
    followThisUser
}
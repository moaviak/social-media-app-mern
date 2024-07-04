import {
  UploadMetadata,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app, storage } from "../config/firebase.config";
import Post from "../models/Post";
// import { auth } from "../config/firebase.config";
// import { signInWithEmailAndPassword } from "firebase/auth";

export const uploadFileToFirebase = async (
  filename: string,
  buffer: ArrayBuffer,
  metadata: UploadMetadata
) => {
  try {
    // await signInWithEmailAndPassword(
    //   auth,
    //   process.env.FIREBASE_USER,
    //   process.env.FIREBASE_AUTH
    // );

    const storageRef = ref(storage, filename);

    const snapshot = await uploadBytesResumable(storageRef, buffer, metadata);

    const downloadUrl = await getDownloadURL(snapshot.ref);

    return [downloadUrl, snapshot.ref];
  } catch (error) {
    console.log("Error while uploading file");
    throw new Error(error);
  }
};

export const getPostsWithCreators = async (
  matchCriteria: object,
  skip: number = 0,
  limit?: number
) => {
  const pipeline: any[] = [
    { $match: matchCriteria },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "creator",
      },
    },
    {
      $addFields: {
        creator: { $arrayElemAt: ["$creator", 0] },
      },
    },
    {
      $project: {
        _id: 1,
        creator: {
          _id: "$creator._id",
          name: "$creator.name",
          profilePicture: "$creator.profilePicture",
        },
        caption: 1,
        tags: 1,
        content: 1,
        location: 1,
        likes: 1,
        comments: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
  ];

  if (limit) {
    pipeline.push({ $limit: limit });
  }

  return await Post.aggregate(pipeline);
};

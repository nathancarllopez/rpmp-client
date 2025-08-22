import { useUpdateProfilePicMutation } from "@/tanstack-query/mutations/updateProfilePic";
import { AspectRatio, Center, Image, Overlay, Title } from "@mantine/core";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";

interface ProfilePicProps {
  profilePicUrl: string;
  showUpload: boolean;
  userId: string | undefined;
}

export default function ProfilePic({
  profilePicUrl,
  showUpload,
  userId,
}: ProfilePicProps) {
  const updateProfilePicMutation = useUpdateProfilePicMutation(userId);

  if (!showUpload) {
    return (
      <AspectRatio ratio={1} w={{ base: "100%", sm: "33%" }}>
        <Image src={profilePicUrl} radius={"50%"} />
      </AspectRatio>
    );
  }

  const handlePicDrop = async (files: FileWithPath[]) => {
    updateProfilePicMutation.mutate(files[0], {
      onSuccess: () => {
        notifications.show({
          withCloseButton: true,
          color: "green",
          title: "Upload Successful",
          message: "Profile picture has been updated",
        });
      },
      onError: (error) => {
        console.warn("Error uploading profile picture: ", error.message);
        notifications.show({
          withCloseButton: true,
          color: "red",
          title: "Upload Failed",
          message: error.message,
        });
      },
    });
  };

  return (
    <Dropzone
      onDrop={handlePicDrop}
      onReject={() =>
        notifications.show({
          withCloseButton: true,
          color: "red",
          title: "Upload Failed",
          message: "Please upload an image file",
        })
      }
      accept={IMAGE_MIME_TYPE}
      radius={"50%"}
      w={{ base: "100%", sm: "33%" }}
      p={0}
    >
      <AspectRatio ratio={1}>
        <Image src={profilePicUrl} radius={"50%"} />
      </AspectRatio>
      <Overlay radius={"50%"}>
        <Center h={"100%"}>
          <Title ta={"center"}>Update Profile Picture</Title>
        </Center>
      </Overlay>
    </Dropzone>
  );
}

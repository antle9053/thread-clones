import { Prisma } from "@prisma/client";

export type LikeResponseDTO = Prisma.likesGetPayload<{
  include: {
    user: true;
  };
}>;

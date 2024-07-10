import { Prisma } from "@prisma/client";

export type ThreadResponseDTO = Prisma.threadsGetPayload<{
  include: {
    author: true;
    parent: true;
    reposted: {
      include: {
        user: true;
      };
    };
    likes: {
      include: {
        user: true;
      };
    };
    content: {
      include: {
        files: true;
        tags: true;
        poll: {
          include: {
            options: true;
          };
        };
      };
    };

    child: {
      include: {
        author: true;
        content: {
          include: {
            files: true;
            tags: true;
            poll: {
              include: {
                options: true;
              };
            };
          };
        };
        _count: {
          select: {
            child: true;
          };
        };
      };
    };
    _count: {
      select: {
        child: true;
        likes: true;
      };
    };
  };
}>;

export type ThreadRepyResponseDTO = Prisma.threadsGetPayload<{
  include: {
    content: true;
    author: true;
  };
}>;

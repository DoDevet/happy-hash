import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(101).keys())].forEach(async (item) => {
    const stream = await client.post.create({
      data: {
        image: "1146c51b-668c-4606-0c16-1f176a4f0c00",
        payload: "TEST",
        title: "TEST",
        hashtag: {
          connect: {
            id: 2,
          },
        },
        user: {
          connect: {
            id: 1,
          },
        },
      },
    });
    console.log(`${item}/500`);
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect());

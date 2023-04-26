import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(101).keys())].forEach(async (item, index) => {
    const stream = await client.post.create({
      data: {
        image: "dadab751-bd9f-4a4a-ded1-9abb2e203600",
        payload: `Test${index}`,
        title: `Test${index}`,
        hashtag: {
          connect: {
            id: 52,
          },
        },
        user: {
          connect: {
            id: 2,
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

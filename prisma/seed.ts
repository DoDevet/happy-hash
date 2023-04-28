import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(100).keys())].forEach(async (item, index) => {
    const stream = await client.post.create({
      data: {
        image: "713830a0-9102-4d9e-4b18-9399144a3700",
        payload: `Test${index}`,
        title: `Test${index}`,
        hashtag: {
          connect: {
            id:
              index < 20
                ? 153
                : index < 40
                ? 154
                : index < 60
                ? 155
                : index < 80
                ? 156
                : 157,
          },
        },
        user: {
          connect: {
            id: 17,
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

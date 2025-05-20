"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const countries = [
    {
        name: 'France',
        code: 'FR',
        flag: '🇫🇷',
        cities: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice'],
    },
    {
        name: 'Espagne',
        code: 'ES',
        flag: '🇪🇸',
        cities: ['Madrid', 'Barcelone', 'Valence', 'Séville', 'Bilbao'],
    },
    {
        name: 'Italie',
        code: 'IT',
        flag: '🇮🇹',
        cities: ['Rome', 'Milan', 'Florence', 'Venise', 'Naples'],
    },
    {
        name: 'Allemagne',
        code: 'DE',
        flag: '🇩🇪',
        cities: ['Berlin', 'Munich', 'Hambourg', 'Francfort', 'Cologne'],
    },
    {
        name: 'Royaume-Uni',
        code: 'GB',
        flag: '🇬🇧',
        cities: ['Londres', 'Manchester', 'Birmingham', 'Liverpool', 'Édimbourg'],
    },
];
async function main() {
    console.log('🌱 Starting seeding...');
    await prisma.visitedPlace.deleteMany();
    await prisma.city.deleteMany();
    await prisma.country.deleteMany();
    for (const countryData of countries) {
        const country = await prisma.country.create({
            data: {
                name: countryData.name,
                code: countryData.code,
                flag: countryData.flag,
            },
        });
        console.log(`✅ Created country: ${country.name}`);
        for (const cityName of countryData.cities) {
            await prisma.city.create({
                data: {
                    name: cityName,
                    countryId: country.id,
                },
            });
        }
    }
    console.log('🌱 Seeding finished.');
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
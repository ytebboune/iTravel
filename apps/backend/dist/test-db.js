"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function testDatabaseChanges() {
    try {
        console.log('🧪 Début des tests...');
        console.log('\n1. Test création utilisateur...');
        const user = await prisma.user.create({
            data: {
                email: 'test@example.com',
                username: 'testuser',
                password: 'hashedpassword123',
            },
        });
        console.log('✅ Utilisateur créé:', user);
        console.log('\n2. Test création projet...');
        const project = await prisma.travelProject.create({
            data: {
                title: 'Test Project',
                description: 'Test Description',
                creatorId: user.id,
                shareCode: 'TEST' + Date.now(),
            },
        });
        console.log('✅ Projet créé:', project);
        console.log('\n3. Test création transport...');
        const transport = await prisma.transportOption.create({
            data: {
                projectId: project.id,
                type: 'PLANE',
                departure: 'Paris',
                arrival: 'New York',
                date: new Date(),
                price: 500.00,
                link: 'https://example.com/flight',
                company: 'Test Airlines',
                addedBy: user.id,
            },
        });
        console.log('✅ Transport créé:', transport);
        console.log('\n4. Test création hébergement...');
        const accommodation = await prisma.accommodation.create({
            data: {
                projectId: project.id,
                name: 'Test Hotel',
                address: '123 Test Street',
                price: 200.00,
                type: 'HOTEL',
            },
        });
        console.log('✅ Hébergement créé:', accommodation);
        console.log('\n5. Test création commentaire...');
        const comment = await prisma.comment.create({
            data: {
                accommodationId: accommodation.id,
                userId: user.id,
                content: 'Test comment with a very long text that should be stored properly in the database...',
            },
        });
        console.log('✅ Commentaire créé:', comment);
        console.log('\n7. Test des index sur les dates...');
        const recentTransports = await prisma.transportOption.findMany({
            where: {
                date: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
        });
        console.log('✅ Recherche par date réussie:', recentTransports.length, 'transports trouvés');
        console.log('\n8. Nettoyage des données de test...');
        await prisma.comment.delete({ where: { id: comment.id } });
        await prisma.accommodation.delete({ where: { id: accommodation.id } });
        await prisma.transportOption.delete({ where: { id: transport.id } });
        await prisma.travelProject.delete({ where: { id: project.id } });
        await prisma.user.delete({ where: { id: user.id } });
        console.log('✅ Données de test supprimées');
        console.log('\n✨ Tous les tests ont réussi !');
    }
    catch (error) {
        console.error('❌ Erreur pendant les tests:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
testDatabaseChanges();
//# sourceMappingURL=test-db.js.map
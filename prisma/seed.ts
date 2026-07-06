import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";
import * as bcrypt from "bcryptjs";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create default user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: "tomas@freelotrack.com" },
    update: {},
    create: {
      email: "tomas@freelotrack.com",
      name: "Tomas",
      hashedPassword,
    },
  });

  console.log("User created:", user.email);

  // Create a sample contract template
  const template = await prisma.contractTemplate.upsert({
    where: { id: "default-template" },
    update: {},
    create: {
      id: "default-template",
      name: "Contrato de Servicios Profesionales - Base",
      description: "Plantilla base para servicios de desarrollo de software",
      content: `# CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES

Entre [CLIENTE_NAME], con domicilio en [CLIENTE_ADDRESS], en adelante "EL CLIENTE", y [FREELANCER_NAME], en adelante "EL PROFESIONAL", se celebra el siguiente contrato sujeto a las siguientes cláusulas:

## 1. OBJETO
EL PROFESIONAL se compromete a realizar los siguientes servicios: [SCOPE]

## 2. PLAZO DE EJECUCIÓN
El presente contrato tendrá una duración desde [START_DATE] hasta [END_DATE].

## 3. PRECIO Y FORMA DE PAGO
EL CLIENTE abonará a EL PROFESIONAL la suma de [PRICE] ([PRICE_TEXT]) en concepto de honorarios.
Forma de pago: [PAYMENT_METHOD]

## 4. ENTREGABLES
[DELIVERABLES]

## 5. OBLIGACIONES DE EL PROFESIONAL
- Realizar los servicios con la debida diligencia y profesionalismo.
- Entregar los trabajos en los plazos acordados.
- Mantener confidencialidad sobre la información de EL CLIENTE.

## 6. OBLIGACIONES DE EL CLIENTE
- Proveer la información necesaria para la realización de los servicios.
- Realizar los pagos en los plazos acordados.
- Revisar y aprobar los entregables en un plazo máximo de 5 días hábiles.

## 7. PROPIEDAD INTELECTUAL
Una vez cancelado el total de los honorarios, los derechos de propiedad intelectual sobre los desarrollos pasarán a ser de EL CLIENTE.

## 8. CONFIDENCIALIDAD
Ambas partes se comprometen a mantener confidencial toda la información intercambiada en el marco del presente contrato.

## 9. RESOLUCIÓN
Cualquiera de las partes puede resolver el contrato mediante preaviso escrito de 15 días.

## 10. JURISDICCIÓN
Las partes se someten a la jurisdicción de los tribunales de [JURISDICTION].

En [CITY], a los [SIGN_DATE].

_________________________              _________________________
[CLIENTE_NAME]                          [FREELANCER_NAME]
EL CLIENTE                              EL PROFESIONAL`,
    },
  });

  console.log("Template created:", template.name);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

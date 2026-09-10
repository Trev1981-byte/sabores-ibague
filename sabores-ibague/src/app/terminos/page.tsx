import Link from "next/link";

export const metadata = {
  title: "Términos de uso — Colcocina",
  description:
    "Cómo funciona Colcocina, qué esperar del sitio y qué no cubrimos como directorio de restaurantes.",
};

export default function TerminosPage() {
  return (
    <main className="wrap legal-page">
      <Link href="/" className="back-link">
        ← Volver al inicio
      </Link>

      <h1>Términos de uso</h1>
      <p className="legal-updated">Última actualización: septiembre de 2026.</p>

      <p>
        Colcocina es un directorio: ayudamos a la gente de Ibagué a encontrar
        restaurantes, food trucks, carritos y puestos de comida, y a
        contactarlos directamente por teléfono o WhatsApp. Al usar el sitio,
        aceptas estos términos.
      </p>

      <h2>Qué es Colcocina (y qué no es)</h2>
      <p>
        Colcocina no es un restaurante, no prepara comida, no procesa pagos y
        no realiza entregas. Solo mostramos información de contacto y del
        menú para que tú decidas dónde comer y te pongas en contacto
        directamente con el negocio. Todo lo que pase después de eso — el
        pedido, el pago, la entrega — queda entre tú y el restaurante.
        Nosotros no somos parte de esa transacción.
      </p>

      <h2>Exactitud de la información</h2>
      <p>
        Los datos de cada restaurante (teléfono, horario, menú, fotos,
        precios) vienen de dos lugares: el propio negocio, cuando se registra
        o edita su información, o fuentes públicas que recopilamos nosotros
        (como su propia página web o redes sociales) cuando todavía no se han
        registrado. En ambos casos, hacemos lo posible por mostrar
        información correcta, pero no lo garantizamos — los horarios cambian,
        los precios suben, un número de teléfono puede quedar desactualizado.
        Confirma los detalles importantes directamente con el restaurante
        antes de hacer un pedido, sobre todo la primera vez.
      </p>

      <h2>Uso bajo tu propio criterio</h2>
      <p>
        Usas el sitio y decides con quién haces negocios bajo tu propio
        criterio. No garantizamos la calidad de la comida, el tiempo de
        entrega, ni el comportamiento de ningún restaurante listado. Nuestra
        página de{" "}
        <Link href="/seguridad">consejos de seguridad</Link> tiene
        recomendaciones prácticas para pedir con más tranquilidad.
      </p>

      <h2>Límite de responsabilidad</h2>
      <p>
        En la medida que lo permita la ley, Colcocina no es responsable por
        pérdidas, daños, disputas, problemas de salud, pedidos no entregados,
        o cualquier otro inconveniente que surja de tu interacción con un
        restaurante que encontraste en el sitio. El sitio se ofrece
        &ldquo;tal cual&rdquo;, sin garantías de ningún tipo.
      </p>

      <h2>Si tienes un restaurante y no te registraste tú mismo</h2>
      <p>
        Algunos listados los agregamos nosotros directamente, usando
        información pública (igual que hacen Google Maps o aplicaciones de
        domicilios), para que el directorio sea útil desde el principio. Si
        tienes un restaurante listado y quieres corregir algo, tomar control
        de tu página con tu propio enlace de edición, o que lo quitemos por
        completo, escríbenos y lo resolvemos rápido — sin preguntas
        complicadas.
      </p>

      <h2>Si registras tu propio restaurante</h2>
      <p>
        Al enviar tu restaurante a través del formulario, confirmas que la
        información es tuya o que tienes autorización para publicarla, y nos
        das permiso para mostrarla públicamente en el sitio. Guarda bien tu
        enlace privado de edición — es la única forma de administrar tu menú
        y tus fotos, y no lo compartas con nadie que no deba tener control
        sobre tu página.
      </p>

      <h2>Cambios a estos términos</h2>
      <p>
        Podemos actualizar estos términos según el sitio vaya creciendo. Si
        haces cambios importantes, los reflejaremos aquí con una nueva fecha
        de actualización.
      </p>

      <h2>Contacto</h2>
      <p>
        ¿Preguntas, correcciones, o quieres que quitemos tu información?
        Escríbenos a{" "}
        <a href="mailto:hello@carehubnetwork.com">
          hello@carehubnetwork.com
        </a>
        .
      </p>
    </main>
  );
}

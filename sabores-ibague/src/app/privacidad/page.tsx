import Link from "next/link";

export const metadata = {
  title: "Política de privacidad — Colcocina",
  description:
    "Qué información recolecta Colcocina, para qué la usamos, y cómo ejercer tus derechos sobre tus datos personales.",
};

export default function PrivacidadPage() {
  return (
    <main className="wrap legal-page">
      <Link href="/" className="back-link">
        ← Volver al inicio
      </Link>

      <h1>Política de privacidad</h1>
      <p className="legal-updated">Última actualización: septiembre de 2026.</p>

      <p>
        Esta página explica qué información recolecta Colcocina, para qué la
        usamos, y qué derechos tienes sobre ella, conforme a la Ley 1581 de
        2012 de Colombia (protección de datos personales / hábeas data).
      </p>

      <h2>Qué información recolectamos</h2>
      <p>Cuando un restaurante se registra o edita su información, recolectamos:</p>
      <ul>
        <li>Nombre del negocio, barrio, rango de precios y horario</li>
        <li>Número de teléfono y, si lo agregan, número de WhatsApp</li>
        <li>Fotos del restaurante y del menú, y los platos con sus precios</li>
        <li>Enlace de Google Maps y una breve descripción, si los proporcionan</li>
      </ul>
      <p>
        No tenemos cuentas de usuario ni pedimos contraseñas. Como visitante
        que solo busca dónde comer, no te pedimos ningún dato personal —
        puedes explorar el sitio libremente.
      </p>

      <h2>Para qué la usamos</h2>
      <p>
        Únicamente para publicar el listado del restaurante en el sitio y
        para revisar los envíos antes de publicarlos. No usamos esta
        información para ningún otro fin, y no la vendemos ni la compartimos
        con terceros para publicidad.
      </p>

      <h2>Qué se muestra públicamente</h2>
      <p>
        El nombre, barrio, horario, teléfono, WhatsApp, menú y fotos de un
        restaurante son públicos en el sitio por diseño — el propósito es
        justamente que los clientes los encuentren y los contacten. Si eres
        dueño de un restaurante y prefieres que corrijamos o quitemos algún
        dato, puedes pedirlo en cualquier momento (ver más abajo).
      </p>

      <h2>Tu enlace privado de edición</h2>
      <p>
        Si registraste tu restaurante, recibiste un enlace privado y único
        para administrar tu menú y tus fotos. Ese enlace no es público y no
        lo compartimos con nadie — trátalo como una contraseña. Si lo
        pierdes, escríbenos para ayudarte a recuperar el acceso.
      </p>

      <h2>Dónde se almacena</h2>
      <p>
        La información vive en Supabase, un proveedor de bases de datos con
        medidas de seguridad estándar de la industria. Como con cualquier
        sitio en internet, el hosting (Vercel) registra automáticamente
        datos técnicos básicos de las visitas (como la dirección IP) por
        razones de seguridad y funcionamiento — no los usamos para
        identificar personas ni los compartimos con nadie.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Conforme a la ley colombiana de protección de datos, tienes derecho a
        conocer, actualizar, rectificar y pedir la eliminación de tu
        información personal en cualquier momento, así como a revocar la
        autorización para tratarla. Para ejercer cualquiera de estos
        derechos — o si simplemente quieres que actualicemos o borremos la
        información de tu restaurante — escríbenos a{" "}
        <a href="mailto:hello@carehubnetwork.com">
          hello@carehubnetwork.com
        </a>{" "}
        y lo resolvemos directamente.
      </p>

      <h2>Cambios a esta política</h2>
      <p>
        Si actualizamos esta política de forma importante, lo reflejaremos
        aquí con una nueva fecha.
      </p>

      <h2>Contacto</h2>
      <p>
        Para cualquier pregunta sobre tus datos, escríbenos a{" "}
        <a href="mailto:hello@carehubnetwork.com">
          hello@carehubnetwork.com
        </a>
        . También puedes revisar nuestros{" "}
        <Link href="/terminos">términos de uso</Link>.
      </p>
    </main>
  );
}

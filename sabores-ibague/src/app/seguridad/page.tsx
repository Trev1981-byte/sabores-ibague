import Link from "next/link";

export const metadata = {
  title: "Consejos de seguridad — Sabores de Ibagué",
  description:
    "Cómo pedir con seguridad en Sabores de Ibagué: qué hacemos nosotros y qué te toca revisar a ti antes de pagar.",
};

export default function SeguridadPage() {
  return (
    <main className="wrap safety-page">
      <Link href="/" className="back-link">
        ← Volver al inicio
      </Link>

      <h1>Consejos para pedir con seguridad</h1>

      <p className="safety-intro">
        Sabores de Ibagué te ayuda a descubrir restaurantes y puestos de
        comida de la ciudad, y te conecta directamente con ellos por
        WhatsApp. A partir de ahí, el pedido, el pago y la entrega quedan
        entre tú y el restaurante — nosotros no participamos en esa parte,
        así que aquí van algunas cosas que te conviene revisar.
      </p>

      <ul className="safety-list">
        <li className="safety-item">
          <span className="safety-item-icon" aria-hidden="true">
            🚚
          </span>
          <div>
            <h3>Prefiere pagar contra entrega</h3>
            <p>
              Sobre todo si es la primera vez que le compras a ese
              restaurante. Es la forma más segura de asegurarte de que tu
              pedido sí llega antes de pagar por él.
            </p>
          </div>
        </li>

        <li className="safety-item">
          <span className="safety-item-icon" aria-hidden="true">
            ⚠️
          </span>
          <div>
            <h3>Desconfía de quien insista en pago adelantado</h3>
            <p>
              Un restaurante real normalmente no tiene problema en que
              pagues al recibir, especialmente con un cliente nuevo. Si te
              presionan para pagar todo por Nequi o transferencia antes de
              ver tu pedido, tómalo con calma.
            </p>
          </div>
        </li>

        <li className="safety-item">
          <span className="safety-item-icon" aria-hidden="true">
            📍
          </span>
          <div>
            <h3>Verifica la ubicación</h3>
            <p>
              Si el restaurante tiene un enlace de Google Maps, revisa que
              el lugar exista y quede donde dicen que queda.
            </p>
          </div>
        </li>

        <li className="safety-item">
          <span className="safety-item-icon" aria-hidden="true">
            👀
          </span>
          <div>
            <h3>Haz caso a tu instinto</h3>
            <p>
              Si algo se siente raro en la conversación — apuro, presión,
              excusas poco claras — probablemente lo es. No tienes que
              continuar con el pedido.
            </p>
          </div>
        </li>

        <li className="safety-item">
          <span className="safety-item-icon" aria-hidden="true">
            💬
          </span>
          <div>
            <h3>El pedido es directo con el restaurante</h3>
            <p>
              Mostramos la información que cada restaurante nos dio al
              registrarse, pero no verificamos cada pedido ni cada pago
              individual — esa parte pasa por fuera del sitio, en tu propia
              conversación de WhatsApp.
            </p>
          </div>
        </li>
      </ul>

      <p className="safety-closing">
        Nuestro trabajo es ayudarte a encontrar buena comida cerca de ti.
        Con estas precauciones, la mayoría de los pedidos salen sin
        ningún problema.
      </p>
    </main>
  );
}

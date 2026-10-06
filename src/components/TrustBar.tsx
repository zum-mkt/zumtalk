import { Highlight, useContent } from "../content/ContentContext";
import { Container, Eyebrow } from "./ui";

// Faixa logo abaixo do hero: parceria oficial com a Meta e uso da WhatsApp Business API.
export default function TrustBar() {
  const { trust } = useContent();
  if (!trust.show) return null;
  return (
    <section aria-label="Parceria oficial" className="border-b border-mist-200 bg-white py-12 sm:py-14">
      <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <Eyebrow>{trust.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">
            <Highlight text={trust.title} className="text-brand-600" />
          </h2>
          {trust.lead && <p className="mt-4 max-w-xl leading-relaxed text-mist-500">{trust.lead}</p>}
        </div>
        <div className="grid grid-cols-2 items-center gap-4 sm:gap-6">
          <div className="grid h-28 place-items-center rounded-2xl border border-mist-200 bg-white px-5 shadow-sm sm:h-32 sm:px-7">
            <img
              src="/meta-business-partner.webp"
              alt="Meta Business Partner"
              width={1094}
              height={432}
              loading="lazy"
              className="max-h-16 w-auto sm:max-h-[4.5rem]"
            />
          </div>
          <div className="grid h-28 place-items-center rounded-2xl border border-mist-200 bg-white px-5 shadow-sm sm:h-32 sm:px-7">
            <img
              src="/whatsapp-business-api.webp"
              alt="WhatsApp Business API"
              width={732}
              height={269}
              loading="lazy"
              className="max-h-14 w-auto sm:max-h-16"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

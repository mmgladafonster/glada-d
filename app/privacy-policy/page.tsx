"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLayoutEffect } from "react"

export default function PrivacyPolicyPage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            Juridiska Policydokument för Glada Fönster Städ AB
          </span>
        </h1>
        <p className="text-center text-gray-600 mb-12">Senast uppdaterad: 21 juni 2025</p>

        <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 space-y-8">
          <p className="leading-relaxed text-gray-700">
            Detta dokument innehåller Integritetspolicy, Användarvillkor och Cookiepolicy för Glada Fönster Städ AB
            ("vi," "oss," eller "vår"), en leverantör av fönsterputstjänster som driver webbplatsen{" "}
            <a href="https://www.gladafonster.se" className="text-blue-600 hover:underline">
              www.gladafonster.se
            </a>{" "}
            ("Webbplatsen"). Genom att använda vår Webbplats eller våra tjänster godkänner du dessa policydokument. Läs
            dem noggrant.
          </p>

          {/* Integritetspolicy */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Integritetspolicy</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Inledning</h3>
            <p className="leading-relaxed text-gray-700">
              Glada Fönster Städ AB är engagerade i att skydda din integritet. Denna Integritetspolicy förklarar hur vi
              samlar in, använder, lagrar och skyddar dina personuppgifter när du använder vår Webbplats eller bokar
              våra fönsterputstjänster.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Information vi samlar in</h3>
            <p className="leading-relaxed text-gray-700">Vi samlar in följande typer av information:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Personuppgifter:</strong> När du kontaktar oss eller bokar tjänster kan vi samla in ditt namn,
                e-postadress, telefonnummer och adress för att behandla din förfrågan eller ge en offert.
              </li>
              <li>
                <strong>Användningsdata:</strong> Vi samlar in icke-identifierbara data om hur du interagerar med vår
                Webbplats, såsom IP-adress, webbläsartyp, besökta sidor och tid på sajten, via cookies eller liknande
                teknologier (se Cookiepolicy nedan).
              </li>
              <li>
                <strong>Kommunikationsdata:</strong> Om du kontaktar oss via e-post, telefon eller Webbplatsens
                kontaktformulär behåller vi innehållet i dina meddelanden och eventuella bilagor.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Hur vi använder din information</h3>
            <p className="leading-relaxed text-gray-700">Vi använder din information för att:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Tillhandahålla och hantera fönsterputstjänster, inklusive bokning och fakturering.</li>
              <li>Svara på förfrågningar och ge kundsupport.</li>
              <li>Förbättra vår Webbplats och tjänster genom analys av användningsdata.</li>
              <li>Skicka uppdateringar eller reklam med ditt uttryckliga samtycke.</li>
              <li>Uppfylla rättsliga skyldigheter, såsom skatte- eller bokföringskrav.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Hur vi samlar in din information</h3>
            <p className="leading-relaxed text-gray-700">Vi samlar in information genom:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Direkta interaktioner:</strong> När du fyller i vårt kontaktformulär, ringer eller e-postar oss.
              </li>
              <li>
                <strong>Automatiserade teknologier:</strong> Cookies och analysverktyg (t.ex. Google Analytics) samlar
                in användningsdata.
              </li>
              <li>
                <strong>Tredje parter:</strong> Begränsad data kan komma från tjänsteleverantörer, såsom
                betalningshanterare.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Delning av din information</h3>
            <p className="leading-relaxed text-gray-700">Vi säljer eller delar inte dina personuppgifter, förutom:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Tjänsteleverantörer:</strong> Betrodda partners (t.ex. betalningshanterare, IT-leverantörer) kan
                få tillgång till dina uppgifter för att leverera tjänster, under strikta sekretessavtal.
              </li>
              <li>
                <strong>Rättsliga krav:</strong> Vi kan lämna ut uppgifter om det krävs enligt lag eller för att skydda
                våra rättigheter, säkerhet eller egendom.
              </li>
              <li>
                <strong>Företagsöverlåtelser:</strong> Vid en fusion eller försäljning kan dina uppgifter överföras, med
                förhandsmeddelande.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Dina dataskyddsrättigheter</h3>
            <p className="leading-relaxed text-gray-700">
              Enligt GDPR (för EU-medborgare) eller andra tillämpliga lagar kan du ha rätt att:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Tillgång:</strong> Begära en kopia av dina personuppgifter.
              </li>
              <li>
                <strong>Rättelse:</strong> Korrigera felaktiga eller ofullständiga uppgifter.
              </li>
              <li>
                <strong>Radering:</strong> Begära radering av dina uppgifter, med förbehåll för rättsliga skyldigheter.
              </li>
              <li>
                <strong>Begränsning:</strong> Begränsa databehandling i vissa fall.
              </li>
              <li>
                <strong>Invändning:</strong> Invända mot behandling för marknadsföring eller andra ändamål.
              </li>
              <li>
                <strong>Dataportabilitet:</strong> Begära dina uppgifter i ett överförbart format.
              </li>
            </ul>
            <p className="leading-relaxed text-gray-700 mt-4">
              Kontakta oss på{" "}
              <a href="mailto:info@gladafonster.se" className="text-blue-600 hover:underline">
                info@gladafonster.se
              </a>{" "}
              för att utöva dessa rättigheter. Vi svarar inom 30 dagar. Du kan också lämna in ett klagomål till en
              dataskyddsmyndighet, såsom Integritetsskyddsmyndigheten i Sverige.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Datasäkerhet</h3>
            <p className="leading-relaxed text-gray-700">
              Vi använder branschstandardåtgärder (t.ex. kryptering, säkra servrar) för att skydda dina uppgifter. Ingen
              internetöverföring är dock 100 % säker, och vi kan inte garantera absolut säkerhet.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Datalagring</h3>
            <p className="leading-relaxed text-gray-700">
              Vi behåller personuppgifter endast så länge som nödvändigt för de ändamål som anges här eller för att
              uppfylla rättsliga krav (t.ex. svenska bokföringslagar).
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Internationella dataöverföringar</h3>
            <p className="leading-relaxed text-gray-700">
              Om du befinner dig utanför Sverige kan dina uppgifter överföras till våra servrar i Sverige eller till
              tredjepartsleverantörer i andra länder. Vi säkerställer att sådana överföringar följer GDPR eller
              motsvarande lagar.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Tredjepartslänkar</h3>
            <p className="leading-relaxed text-gray-700">
              Vår Webbplats kan innehålla länkar till tredjepartssidor. Vi ansvarar inte för deras integritetsrutiner,
              så granska deras policydokument innan du delar information.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Ändringar i denna Integritetspolicy</h3>
            <p className="leading-relaxed text-gray-700">
              Vi kan uppdatera denna policy med jämna mellanrum. Väsentliga ändringar meddelas via vår Webbplats eller
              e-post. Kontrollera denna sida regelbundet.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Kontakta oss</h3>
            <p className="leading-relaxed text-gray-700">
              För frågor om denna Integritetspolicy, kontakta:
              <br />
              Glada Fönster Städ AB
              <br />
              E-post:{" "}
              <a href="mailto:info@gladafonster.se" className="text-blue-600 hover:underline">
                info@gladafonster.se
              </a>
              <br />
              Telefon: +46 072-851-2420
              <br />
              Adress: Brinkens Väg 16, 439 53 Åsa
            </p>
          </section>

          {/* Användarvillkor */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Användarvillkor</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Inledning</h3>
            <p className="leading-relaxed text-gray-700">
              Dessa Användarvillkor ("Villkor") reglerar din användning av vår Webbplats och fönsterputstjänster. Genom
              att använda vår Webbplats eller boka tjänster godkänner du dessa Villkor.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Användning av våra tjänster</h3>
            <p className="leading-relaxed text-gray-700">
              Vi tillhandahåller fönsterputstjänster i Varberg, Åskloster, Väröbacka, Bua, Frillesås, Åsa, Kullavik,
              Särö, Kungsbacka, Billdal, Askim, Mölndal, Göteborg, Kungälv, Torslanda och närliggande områden. För att
              använda våra tjänster måste du:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Vara minst 18 år eller ha vårdnadshavares samtycke.</li>
              <li>Tillhandahålla korrekt kontakt- och betalningsinformation.</li>
              <li>Följa dessa Villkor och tillämpliga lagar.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Bokning och betalning</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Bokning:</strong> Boka via vår Webbplats, e-post eller telefon. Vi bekräftar datum, tid och
                kostnad före tjänsten.
              </li>
              <li>
                <strong>Betalning:</strong> Betalning ska ske vid tjänstens slutförande om inget annat avtalats. Vi
                accepterar banköverföringar och kortbetalningar.
              </li>
              <li>
                <strong>Avbokningar:</strong> Meddela oss minst 24 timmar i förväg. Sena avbokningar kan medföra en
                avgift.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Servicegaranti</h3>
            <p className="leading-relaxed text-gray-700">
              Om du inte är nöjd, meddela oss inom 48 timmar, så åtgärdar vi problemet utan extra kostnad, enligt vårt
              omdöme.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Säkerhet och åtkomst</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Ge säker och rimlig åtkomst till områden som ska rengöras.</li>
              <li>
                Vi kan vägra tjänster om förhållandena är osäkra eller om kunder inte respekterar vår personal eller
                arbetskvalitet.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Ansvar</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Vi har försäkring för ansvar och arbetsplatsolyckor. Om våra tjänster orsakar skada åtgärdar vi det
                snabbt.
              </li>
              <li>Vi ansvarar inte för befintliga skador, normalt slitage eller externa faktorer (t.ex. väder).</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Förbjudet beteende</h3>
            <p className="leading-relaxed text-gray-700">Du får inte:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Använda vår Webbplats eller tjänster olagligt.</li>
              <li>Störa Webbplatsens funktionalitet (t.ex. genom hacking).</li>
              <li>Trakassera eller behandla vår personal illa.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Immateriella rättigheter</h3>
            <p className="leading-relaxed text-gray-700">
              Allt innehåll på vår Webbplats (text, bilder, logotyper) ägs av Glada Fönster Städ AB eller våra
              licensgivare. Du får inte reproducera eller distribuera det utan tillstånd.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Uppsägning</h3>
            <p className="leading-relaxed text-gray-700">
              Vi kan stänga av eller avsluta din åtkomst till vår Webbplats eller tjänster om du bryter mot dessa
              Villkor eller skadar vår verksamhet eller personal.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Ändringar i dessa Villkor</h3>
            <p className="leading-relaxed text-gray-700">
              Vi kan uppdatera dessa Villkor med jämna mellanrum. Väsentliga ändringar meddelas på vår Webbplats eller
              direkt. Fortsatt användning innebär godkännande.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Tillämplig lag</h3>
            <p className="leading-relaxed text-gray-700">
              Dessa Villkor styrs av svensk lag. Tvister ska lösas i domstolarna i Göteborg, Sverige.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Kontakta oss</h3>
            <p className="leading-relaxed text-gray-700">
              För frågor om dessa Villkor, kontakta:
              <br />
              Glada Fönster Städ AB
              <br />
              E-post:{" "}
              <a href="mailto:info@gladafonster.se" className="text-blue-600 hover:underline">
                info@gladafonster.se
              </a>
              <br />
              Telefon: +46 072-851-2420
              <br />
              Adress: Brinkens Väg 16, 439 53 Åsa
            </p>
          </section>

          {/* Cookiepolicy */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Cookiepolicy</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Inledning</h3>
            <p className="leading-relaxed text-gray-700">
              Vi använder cookies och liknande teknologier på vår Webbplats för att förbättra din upplevelse och
              analysera användning. Denna Cookiepolicy förklarar vad cookies är, hur vi använder dem och hur du kan
              hantera dem.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Vad är cookies?</h3>
            <p className="leading-relaxed text-gray-700">
              Cookies är små textfiler som lagras på din enhet när du besöker vår Webbplats. De hjälper oss att minnas
              dina preferenser, förbättra funktionalitet och analysera besökarbeteende.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Typer av cookies vi använder</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Nödvändiga cookies:</strong> Nödvändiga för Webbplatsens funktion (t.ex. formulärinmatning).
                Dessa kan inte inaktiveras.
              </li>
              <li>
                <strong>Analyscookies:</strong> Spårar användning (t.ex. via Google Analytics) för att förbättra vår
                Webbplats. Data är anonymiserad.
              </li>
              <li>
                <strong>Preferenscookies:</strong> Lagrar inställningar som språk eller region.
              </li>
              <li>
                <strong>Marknadsföringscookies:</strong> Levererar relevanta annonser, används endast med ditt samtycke.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Tredjepartscookies</h3>
            <p className="leading-relaxed text-gray-700">Vissa cookies sätts av tredje parter, såsom:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Google Analytics: Spårar Webbplatsens prestanda.</li>
              <li>Betalningsleverantörer: Behandlar säkra transaktioner.</li>
            </ul>
            <p className="leading-relaxed text-gray-700 mt-4">
              Vi säkerställer att tredje parter följer GDPR och andra integritetslagar.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Hur vi använder cookies</h3>
            <p className="leading-relaxed text-gray-700">Cookies hjälper oss att:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Säkerställa Webbplatsens funktionalitet.</li>
              <li>Analysera prestanda och besökarbeteende.</li>
              <li>Personalisera din upplevelse.</li>
              <li>Leverera riktade annonser (med samtycke).</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Hantera cookies</h3>
            <p className="leading-relaxed text-gray-700">Du kan styra cookies via:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Cookiebanner:</strong> Godkänn eller avvisa icke-nödvändiga cookies vid besök på vår Webbplats.
              </li>
              <li>
                <strong>Webbläsarinställningar:</strong> Blockera eller radera cookies, men detta kan begränsa vissa
                funktioner.
              </li>
              <li>
                <strong>Avanmälningslänkar:</strong> Välj bort tredjepartscookies (t.ex. Google Analytics) via deras
                verktyg.
              </li>
            </ul>
            <p className="leading-relaxed text-gray-700 mt-4">Se din webbläsares hjälpsida för mer information.</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Ditt samtycke</h3>
            <p className="leading-relaxed text-gray-700">
              Genom att klicka på ”Acceptera” i vår cookiebanner godkänner du icke-nödvändiga cookies. Du kan när som
              helst återkalla samtycket via cookieinställningar eller genom att kontakta oss.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Uppdateringar av denna Cookiepolicy</h3>
            <p className="leading-relaxed text-gray-700">
              Vi kan uppdatera denna policy med jämna mellanrum. Väsentliga ändringar meddelas på vår Webbplats eller
              direkt.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Kontakta oss</h3>
            <p className="leading-relaxed text-gray-700">
              För frågor om denna Cookiepolicy, kontakta:
              <br />
              Glada Fönster Städ AB
              <br />
              E-post:{" "}
              <a href="mailto:info@gladafonster.se" className="text-blue-600 hover:underline">
                info@gladafonster.se
              </a>
              <br />
              Telefon: +46 072-851-2420
              <br />
              Adress: Brinkens Väg 16, 439 53 Åsa
            </p>
          </section>

          <p className="text-center text-gray-700 mt-8 pt-8 border-t border-gray-200">
            Genom att använda vår Webbplats eller tjänster godkänner du dessa policydokument. För ytterligare hjälp,
            kontakta oss på{" "}
            <a href="mailto:info@gladafonster.se" className="text-blue-600 hover:underline">
              info@gladafonster.se
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

import {
  Activity,
  Bike,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CookingPot,
  CreditCard,
  Heart,
  History,
  MapPin,
  Play,
  ReceiptText,
  Route,
  Search,
  ShoppingBag,
  Smartphone,
  Store,
  Truck,
  UserRoundCheck,
  Video,
} from "lucide-react";
import {
  DocBullets,
  DocCallout,
  DocCard,
  DocChapter,
  DocFlow,
  DocGrid,
  DocSteps,
  DocTopic,
} from "./doc-primitives";

export function DocumentationContent() {
  return (
    <>
      <DocChapter
        id="afrobite"
        number="01"
        label="AfroBite"
        title="L’essentiel, simplement"
        lead="AfroBite permet de découvrir des plats en vidéo, commander auprès d’un restaurant et choisir entre livraison et retrait."
      >
        <DocTopic id="introduction" title="Bienvenue sur AfroBite" eyebrow="En quelques mots">
          <p>
            AfroBite rapproche les amateurs de cuisine, les restaurants et les livreurs dans une
            expérience fluide. Chacun dispose de son application et ne voit que les informations
            utiles à son parcours.
          </p>
          <DocGrid columns={3}>
            <DocCard icon={Smartphone} title="AfroBite">
              Découvrir, commander, payer et suivre son repas.
            </DocCard>
            <DocCard icon={Store} title="AfroBite Resto">
              Recevoir les commandes et gérer son restaurant.
            </DocCard>
            <DocCard icon={Bike} title="AfroBite Livreur">
              Accepter une course et livrer le client.
            </DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="fonctionnement" title="La commande en bref" eyebrow="Le parcours commun">
          <DocFlow
            items={[
              { label: "Découvrir" },
              { label: "Commander" },
              { label: "Acceptation" },
              { label: "Paiement" },
              { label: "Préparation" },
              { label: "Réception" },
            ]}
          />
          <p>
            Le restaurant confirme d’abord qu’il peut réaliser la commande. Le client paie ensuite,
            puis la préparation commence. Les étapes suivantes dépendent du choix entre livraison
            et retrait au restaurant.
          </p>
        </DocTopic>

        <DocTopic id="livraison-ou-retrait" title="Livraison ou retrait ?" eyebrow="Deux expériences distinctes">
          <div className="doc-compare">
            <div className="doc-compare-panel doc-compare-delivery">
              <span className="doc-compare-icon"><Truck size={23} /></span>
              <p>Livraison</p>
              <h4>Le repas vient à vous</h4>
              <ul>
                <li>Adresse de livraison</li>
                <li>Livreur et suivi du trajet</li>
                <li>Code à communiquer à l’arrivée</li>
              </ul>
            </div>
            <div className="doc-compare-panel doc-compare-pickup">
              <span className="doc-compare-icon"><ShoppingBag size={23} /></span>
              <p>Retrait</p>
              <h4>Vous récupérez sur place</h4>
              <ul>
                <li>Pas d’adresse ni de livreur</li>
                <li>Notification lorsque le plat est prêt</li>
                <li>Code à présenter au restaurant</li>
              </ul>
            </div>
          </div>
        </DocTopic>
      </DocChapter>

      <DocChapter
        id="utilisateur"
        number="02"
        label="Utilisateur"
        title="Découvrir, choisir, savourer"
        lead="Tout le parcours client, depuis la première vidéo jusqu’à la réception de la commande."
      >
        <DocTopic id="decouvrir" title="Trouver le plat qui vous plaît" eyebrow="Découverte">
          <DocGrid columns={3}>
            <DocCard icon={Play} title="Regarder">
              Parcourez le feed vidéo et découvrez les plats tels qu’ils sont préparés.
            </DocCard>
            <DocCard icon={Search} title="Rechercher">
              Retrouvez un restaurant, un plat ou une vidéo selon votre envie.
            </DocCard>
            <DocCard icon={Heart} title="Garder">
              Enregistrez vos vidéos préférées et revenez-y plus tard.
            </DocCard>
          </DocGrid>
          <DocCallout title="Bon à savoir">
            Les plats proposés dépendent de la disponibilité du restaurant et de votre zone.
          </DocCallout>
        </DocTopic>

        <DocTopic id="passer-commande" title="Commander en quelques étapes" eyebrow="Du plat au panier">
          <DocSteps
            items={[
              { title: "Choisissez vos plats", text: "Ajoutez les quantités souhaitées et une note si nécessaire." },
              { title: "Vérifiez le panier", text: "Relisez les articles et le montant avant de continuer." },
              { title: "Choisissez le mode", text: "Sélectionnez livraison ou retrait selon les options disponibles." },
              { title: "Ajoutez les informations utiles", text: "Indiquez l’adresse pour une livraison et vos éventuelles instructions." },
              { title: "Confirmez", text: "Le restaurant reçoit votre demande et vous informe dès qu’elle est acceptée." },
            ]}
          />
        </DocTopic>

        <DocTopic id="paiement" title="Payer après l’acceptation" eyebrow="Paiement">
          <DocCard icon={CreditCard} title="Pourquoi attendre ?" tone="gold">
            Le paiement devient disponible après l’acceptation du restaurant. Vous ne payez donc
            qu’une commande que le restaurant a confirmé pouvoir préparer.
          </DocCard>
          <p>
            Choisissez le moyen de paiement affiché dans l’application, vérifiez le numéro et le
            montant, puis suivez les indications. La commande avance automatiquement lorsque le
            paiement est confirmé.
          </p>
        </DocTopic>

        <DocTopic id="recevoir-commande-client" title="Recevoir sa commande" eyebrow="Livraison ou retrait">
          <DocGrid>
            <DocCard icon={Route} title="En livraison">
              Suivez la préparation puis le trajet du livreur. À son arrivée, communiquez le code
              à 4 chiffres visible dans l’application.
            </DocCard>
            <DocCard icon={ShoppingBag} title="En retrait">
              Attendez que le plat soit prêt, rendez-vous au restaurant et présentez votre code de
              retrait à 4 chiffres.
            </DocCard>
          </DocGrid>
          <DocCallout title="Gardez votre code pour vous" tone="important">
            Communiquez-le uniquement au moment de recevoir votre repas, au livreur ou au restaurant
            selon le mode choisi.
          </DocCallout>
        </DocTopic>

        <DocTopic id="suivi-commande" title="Suivi et historique" eyebrow="Rester informé">
          <DocGrid columns={3}>
            <DocCard icon={Activity} title="Progression">
              Consultez les étapes : acceptation, paiement, préparation et réception.
            </DocCard>
            <DocCard icon={MapPin} title="Trajet">
              Pour une livraison, suivez la progression lorsque le livreur est en route.
            </DocCard>
            <DocCard icon={History} title="Historique">
              Retrouvez vos commandes passées, leur détail et les actions disponibles.
            </DocCard>
          </DocGrid>
        </DocTopic>
      </DocChapter>

      <DocChapter
        id="restaurant"
        number="03"
        label="Restaurant partenaire"
        title="Un service clair, du reçu à la remise"
        lead="AfroBite Resto accompagne le restaurant pendant le service et simplifie la gestion de son offre."
      >
        <DocTopic id="afrobite-resto" title="Prendre en main AfroBite Resto" eyebrow="Votre espace partenaire">
          <DocGrid columns={3}>
            <DocCard icon={ReceiptText} title="Commandes">Répondez et suivez la préparation.</DocCard>
            <DocCard icon={CookingPot} title="Plats">Tenez votre catalogue à jour.</DocCard>
            <DocCard icon={Video} title="Vidéos">Présentez vos plats en vidéo.</DocCard>
            <DocCard icon={CircleDollarSign} title="Revenus">Consultez les informations disponibles.</DocCard>
            <DocCard icon={History} title="Historique">Retrouvez l’activité du restaurant.</DocCard>
            <DocCard icon={UserRoundCheck} title="Profil">Gérez les informations du compte.</DocCard>
          </DocGrid>
          <DocCallout title="Tablette ou téléphone ?">
            C’est la même application. Une tablette dédiée est pratique pendant le service ; le
            téléphone reste adapté à la gestion quotidienne.
          </DocCallout>
        </DocTopic>

        <DocTopic id="recevoir-commande" title="Lorsqu’une commande arrive" eyebrow="Rester réactif">
          <DocSteps
            items={[
              { title: "Ouvrez la commande", text: "L’alerte vous conduit vers la nouvelle demande." },
              { title: "Vérifiez les détails", text: "Relisez les plats, quantités, notes et le mode de récupération." },
              { title: "Décidez rapidement", text: "Acceptez avec un délai réaliste ou refusez avec un motif." },
            ]}
          />
          <DocCallout title="Conseil de service" tone="important">
            Gardez l’application ouverte, l’appareil chargé et les alertes actives pendant vos heures
            d’ouverture.
          </DocCallout>
        </DocTopic>

        <DocTopic id="accepter-refuser" title="Accepter ou refuser" eyebrow="Une décision claire">
          <DocGrid>
            <DocCard icon={CheckCircle2} title="Accepter">
              Choisissez le temps estimé nécessaire. Le client pourra ensuite effectuer le paiement.
            </DocCard>
            <DocCard icon={Clock3} title="Refuser">
              Si vous ne pouvez pas préparer la commande, indiquez le motif proposé dans l’application.
            </DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="preparation-restaurant" title="Paiement et préparation" eyebrow="La règle essentielle">
          <DocFlow
            items={[
              { label: "Commande acceptée" },
              { label: "Paiement confirmé" },
              { label: "En préparation" },
              { label: "Plat prêt" },
            ]}
          />
          <DocCallout title="Ne préparez pas avant le paiement" tone="important">
            Attendez toujours que l’application confirme le paiement. Une commande acceptée n’est
            pas encore une commande payée.
          </DocCallout>
          <p>
            Une fois payé, relisez les instructions, démarrez la préparation et marquez le plat prêt
            seulement lorsqu’il est complet et correctement emballé.
          </p>
        </DocTopic>

        <DocTopic id="remise-restaurant" title="Remettre la bonne commande" eyebrow="Dernière vérification">
          <DocGrid>
            <DocCard icon={Bike} title="Au livreur">
              Vérifiez la référence puis saisissez le code à 4 chiffres présenté par le livreur.
              Remettez la commande après validation.
            </DocCard>
            <DocCard icon={ShoppingBag} title="Au client">
              Pour un retrait, vérifiez la référence et saisissez le code à 4 chiffres présenté par
              le client avant la remise.
            </DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="gerer-restaurant" title="Gérer son restaurant" eyebrow="En dehors du service">
          <DocBullets>
            <li>Mettez à jour les plats et leur disponibilité.</li>
            <li>Publiez des vidéos représentatives de votre offre.</li>
            <li>Consultez les revenus et l’historique depuis les onglets dédiés.</li>
            <li>Gardez les informations du restaurant et du profil à jour.</li>
          </DocBullets>
        </DocTopic>
      </DocChapter>

      <DocChapter
        id="livraison"
        number="04"
        label="Livreur partenaire"
        title="Une course, étape par étape"
        lead="AfroBite Livreur rassemble les offres, la navigation, les confirmations et l’historique des courses."
      >
        <DocTopic id="afrobite-livreur" title="Prendre en main l’application" eyebrow="Votre outil de route">
          <DocGrid columns={3}>
            <DocCard icon={MapPin} title="Carte">Consultez votre position et la course active.</DocCard>
            <DocCard icon={Truck} title="Livraisons">Retrouvez les offres et les courses.</DocCard>
            <DocCard icon={CircleDollarSign} title="Gains">Consultez les montants associés à vos courses.</DocCard>
          </DocGrid>
          <p>
            Activez votre disponibilité lorsque vous êtes prêt à recevoir une proposition. Gardez
            la localisation autorisée et le téléphone suffisamment chargé pendant la course.
          </p>
        </DocTopic>

        <DocTopic id="offres-livraison" title="Recevoir et accepter une course" eyebrow="Avant de s’engager">
          <DocCard icon={Clock3} title="Lisez l’offre avant d’accepter" tone="gold">
            L’application présente le restaurant, les zones de retrait et de livraison, les temps
            estimés, la distance lorsqu’elle est disponible et le montant de la course.
          </DocCard>
          <p>
            Vous pouvez accepter ou refuser pendant le temps affiché. Après acceptation, la course
            devient votre livraison active et le guidage vous accompagne vers le restaurant.
          </p>
        </DocTopic>

        <DocTopic id="recuperation-restaurant" title="Récupérer au restaurant" eyebrow="Premier trajet">
          <DocSteps
            items={[
              { title: "Rejoignez le restaurant", text: "Suivez le guidage et vérifiez la référence de la commande." },
              { title: "Signalez votre arrivée", text: "Faites avancer la course depuis l’application." },
              { title: "Présentez votre code", text: "Montrez au restaurant le code de récupération à 4 chiffres." },
              { title: "Attendez la validation", text: "Ne partez qu’après confirmation de la remise dans l’application." },
            ]}
          />
        </DocTopic>

        <DocTopic id="livraison-au-client" title="Livrer au client" eyebrow="Dernier trajet">
          <DocSteps
            items={[
              { title: "Suivez l’itinéraire", text: "Rejoignez l’adresse de livraison indiquée." },
              { title: "Signalez votre arrivée", text: "Rencontrez le client et vérifiez la commande." },
              { title: "Demandez le code client", text: "Saisissez le code à 4 chiffres communiqué au moment de la remise." },
              { title: "Terminez la course", text: "La validation du code confirme la livraison." },
            ]}
          />
          <DocCallout title="Le code protège les deux parties" tone="success">
            Ne finalisez jamais une livraison sans le code fourni par le client dans son application.
          </DocCallout>
        </DocTopic>

        <DocTopic id="historique-livreur" title="Retrouver ses courses" eyebrow="Après la livraison">
          <p>
            L’historique affiche les livraisons terminées avec leur référence, les principaux jalons,
            le trajet et le montant associé. Le profil donne également accès aux informations du
            compte et à l’aide disponible.
          </p>
        </DocTopic>
      </DocChapter>
    </>
  );
}

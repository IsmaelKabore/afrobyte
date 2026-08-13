import {
  Activity,
  BadgeCheck,
  Bike,
  BookOpenCheck,
  ChartNoAxesCombined,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Code2,
  Compass,
  CreditCard,
  Database,
  History,
  LayoutDashboard,
  ListChecks,
  MapPin,
  PackageCheck,
  Radio,
  ReceiptText,
  Route,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  Tablet,
  TicketCheck,
  Truck,
  UserRoundCheck,
  UsersRound,
  Video,
  WalletCards,
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
        title="Comprendre l’écosystème"
        lead="AfroBite relie la découverte de plats, la prise de commande, les opérations du restaurant, la livraison et la supervision dans un même cycle suivi."
      >
        <DocTopic id="introduction" title="Introduction" eyebrow="Point de départ">
          <p>
            AfroBite est un écosystème de commande de repas centré sur la découverte visuelle.
            Le client peut partir d’un restaurant, d’un plat ou d’une vidéo, puis suivre sa
            commande jusqu’à la livraison ou au retrait. Les partenaires travaillent dans des
            applications dédiées, tandis que l’équipe AfroBite supervise l’ensemble depuis des
            outils administratifs à accès contrôlé.
          </p>
          <DocGrid columns={3}>
            <DocCard icon={Smartphone} title="Client">
              Découverte, panier, choix livraison ou retrait, paiement et suivi.
            </DocCard>
            <DocCard icon={Store} title="Restaurant">
              Réponse à la commande, préparation, catalogue, vidéos et revenus.
            </DocCard>
            <DocCard icon={Bike} title="Livraison">
              Disponibilité, offres de course, navigation, preuves de remise et historique.
            </DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="fonctionnement" title="Comment fonctionne AfroBite" eyebrow="Une commande, plusieurs acteurs">
          <DocFlow
            items={[
              { label: "Découverte", meta: "Client" },
              { label: "Commande", meta: "Client" },
              { label: "Acceptation", meta: "Restaurant" },
              { label: "Paiement", meta: "Client" },
              { label: "Préparation", meta: "Restaurant" },
              { label: "Remise", meta: "Livreur ou client" },
              { label: "Clôture", meta: "Historique" },
            ]}
          />
          <p>
            Le document de commande partagé porte le statut courant et les jalons utiles. Chaque
            application n’expose que les actions adaptées à son rôle. Les transitions sont
            contrôlées : une commande acceptée n’est pas encore une commande payée, et une
            livraison n’est pas terminée sans la validation prévue.
          </p>
        </DocTopic>

        <DocTopic id="cycle-commande" title="Cycle complet d’une commande" eyebrow="Référence commune">
          <DocSteps
            items={[
              { title: "Création", status: "À accepter", text: "Le client confirme le panier et le mode de récupération. La commande attend la réponse du restaurant." },
              { title: "Réponse restaurant", status: "Acceptée ou refusée", text: "Le restaurant accepte avec un temps de préparation estimé, ou refuse avec un motif." },
              { title: "Paiement client", status: "En attente de paiement", text: "Après acceptation, le client effectue le paiement. La préparation ne doit pas commencer avant confirmation." },
              { title: "Préparation", status: "Payée → En préparation", text: "La confirmation de paiement déverrouille l’action de préparation, puis le restaurant marque le plat prêt." },
              { title: "Remise", status: "Livraison ou retrait", text: "En livraison, un livreur est assigné et récupère la commande. En retrait, le client se présente au restaurant." },
              { title: "Confirmation", status: "Terminée", text: "Les codes prévus valident la remise. La commande rejoint ensuite l’historique des acteurs concernés." },
            ]}
          />
          <DocCallout title="Deux parcours à ne pas confondre" tone="important">
            <p>
              La livraison passe par une course, un livreur, un suivi et un code final client. Le
              retrait ne crée pas de course : le client récupère directement au restaurant avec
              son code de retrait.
            </p>
          </DocCallout>
        </DocTopic>
      </DocChapter>

      <DocChapter
        id="utilisateur"
        number="02"
        label="Utilisateur"
        title="De la découverte au repas"
        lead="L’application client organise la découverte, le panier, le paiement et le suivi tout en gardant livraison et retrait clairement séparés."
      >
        <DocTopic id="decouvrir-restaurants" title="Découvrir les restaurants" eyebrow="Explorer">
          <DocGrid>
            <DocCard icon={Compass} title="Accueil et découvertes">
              Les écrans d’accueil et de découverte présentent les restaurants et plats disponibles,
              avec une prise en compte de la disponibilité liée à la distance.
            </DocCard>
            <DocCard icon={Search} title="Recherche et fiche restaurant">
              La recherche mène aux restaurants, plats ou vidéos. La fiche restaurant regroupe
              son identité, son catalogue et ses contenus.
            </DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="feed-video" title="Feed vidéo" eyebrow="Découverte visuelle">
          <p>
            Le feed vertical permet de parcourir les vidéos publiées par les restaurants. Une
            vidéo peut ouvrir le plat ou le restaurant associé ; le plat peut ensuite être ajouté
            au panier. L’application gère aussi les favoris, les vidéos enregistrées, les
            commentaires et les liens profonds vers une vidéo.
          </p>
          <DocCallout title="Le feed n’est pas un catalogue isolé">
            Chaque contenu garde un lien avec l’offre du restaurant. La disponibilité réelle du
            plat et du restaurant reste déterminante au moment de commander.
          </DocCallout>
        </DocTopic>

        <DocTopic id="passer-commande" title="Passer une commande" eyebrow="Panier et checkout">
          <DocSteps
            items={[
              { title: "Ajouter les plats", text: "Sélectionner les quantités et, si nécessaire, ajouter une note au plat." },
              { title: "Ouvrir le panier", text: "Vérifier les articles regroupés pour le restaurant et les montants affichés." },
              { title: "Choisir le mode", text: "Sélectionner livraison ou retrait selon les options réellement disponibles." },
              { title: "Compléter les informations", text: "Pour une livraison, choisir une adresse. Ajouter si besoin des instructions générales." },
              { title: "Confirmer", text: "La commande est créée en attente de réponse du restaurant ; le paiement intervient après acceptation." },
            ]}
          />
        </DocTopic>

        <DocTopic id="paiement" title="Paiement" eyebrow="Après acceptation">
          <p>
            L’écran de paiement s’ouvre lorsque le restaurant a accepté la commande. L’application
            propose les moyens Mobile Money actuellement intégrés, avec le numéro de paiement et
            le détail du montant. Elle observe ensuite la confirmation du paiement avant de faire
            avancer la commande.
          </p>
          <DocCallout title="Règle opérationnelle centrale" tone="important">
            Tant que la commande n’affiche pas la confirmation de paiement, le restaurant ne doit
            pas démarrer la préparation. Une initiation de paiement n’est pas une confirmation.
          </DocCallout>
        </DocTopic>

        <DocTopic id="livraison-client" title="Commande en livraison" eyebrow="Parcours A">
          <DocFlow
            items={[
              { label: "Adresse" },
              { label: "Acceptation resto" },
              { label: "Paiement confirmé" },
              { label: "Préparation" },
              { label: "Livreur assigné" },
              { label: "En route" },
              { label: "Code client" },
            ]}
          />
          <DocBullets>
            <li>L’adresse et les éventuelles instructions de livraison sont liées à la commande.</li>
            <li>Le système cherche un livreur disponible et peut continuer la recherche si une offre expire.</li>
            <li>Le suivi en direct devient pertinent une fois la course prise et pendant le déplacement.</li>
            <li>À l’arrivée, le client communique son code de confirmation à 4 chiffres au livreur.</li>
          </DocBullets>
        </DocTopic>

        <DocTopic id="retrait-client" title="Retrait au restaurant" eyebrow="Parcours B">
          <DocFlow
            items={[
              { label: "Choix retrait" },
              { label: "Acceptation resto" },
              { label: "Paiement confirmé" },
              { label: "Préparation" },
              { label: "Plat prêt" },
              { label: "Code de retrait" },
            ]}
          />
          <p>
            Aucune adresse de livraison ni attribution de livreur n’est nécessaire. Lorsque le
            plat est prêt, le client se rend au restaurant et présente le code de retrait à
            4 chiffres affiché dans son suivi. Le restaurant saisit ce code pour confirmer la remise.
          </p>
        </DocTopic>

        <DocTopic id="suivi-commande" title="Suivre une commande" eyebrow="État en temps réel">
          <DocGrid columns={3}>
            <DocCard icon={Activity} title="Timeline">
              Le suivi traduit les statuts en étapes lisibles : acceptation, paiement, préparation,
              plat prêt, trajet et finalisation.
            </DocCard>
            <DocCard icon={MapPin} title="Carte de livraison">
              Pour les commandes livrées, une vue dédiée permet de suivre la progression du livreur
              lorsque les données de course sont disponibles.
            </DocCard>
            <DocCard icon={BadgeCheck} title="Actions contextuelles">
              Paiement, code de retrait, confirmation ou réclamation apparaissent selon l’état réel
              de la commande.
            </DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="historique-client" title="Historique des commandes" eyebrow="Après la commande">
          <p>
            L’espace Activité et l’historique regroupent les commandes en cours et passées. Le
            client peut consulter le détail, retrouver les articles, les montants, le mode de
            récupération, les jalons et, lorsque l’action est disponible, recommander ou laisser
            un avis.
          </p>
        </DocTopic>
      </DocChapter>

      <DocChapter
        id="restaurant"
        number="03"
        label="Restaurant"
        title="Piloter le service sans ambiguïté"
        lead="AfroBite Resto regroupe les opérations de commande et la gestion du partenaire. La séquence acceptation → paiement → préparation est impérative."
      >
        <DocTopic id="restaurant-introduction" title="Le rôle du restaurant" eyebrow="Responsabilité partenaire">
          <p>
            Le restaurant maintient son offre, répond aux nouvelles commandes, annonce un délai
            réaliste, prépare uniquement après paiement confirmé et valide la remise. Une réponse
            rapide évite qu’une commande reste bloquée et facilite le travail du support.
          </p>
        </DocTopic>

        <DocTopic id="afrobite-resto" title="Application AfroBite Resto" eyebrow="Une application dédiée">
          <DocGrid columns={3}>
            <DocCard icon={LayoutDashboard} title="Tableau de bord">
              Vue opérationnelle des commandes, statuts et actions autorisées.
            </DocCard>
            <DocCard icon={ShoppingBag} title="Mes plats">
              Gestion du catalogue et de la disponibilité des plats.
            </DocCard>
            <DocCard icon={CircleDollarSign} title="Revenus">
              Consultation des revenus et des informations financières du restaurant.
            </DocCard>
            <DocCard icon={Video} title="Ajouter">
              Publication des vidéos rattachées à l’offre du restaurant.
            </DocCard>
            <DocCard icon={History} title="Activité et historique">
              Consultation des commandes et de leur progression depuis les vues dédiées.
            </DocCard>
            <DocCard icon={Store} title="Profil">
              Compte partenaire, informations du restaurant et réglages disponibles.
            </DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="tablette-restaurant" title="Tablette restaurant" eyebrow="Poste de service conseillé">
          <DocCard icon={Tablet} title="Priorité aux opérations" tone="gold">
            <DocBullets>
              <li>Laisser AfroBite Resto ouvert pendant le service et garder le son/vibreur autorisé.</li>
              <li>Surveiller le tableau de bord, les nouvelles commandes et les badges.</li>
              <li>Accepter ou refuser, puis faire progresser préparation et remise.</li>
              <li>Saisir le code présenté au moment de la remise lorsque l’écran le demande.</li>
            </DocBullets>
          </DocCard>
          <DocCallout title="Ce que le code implémente réellement">
            Il n’existe pas une application « tablette » séparée : il s’agit de la même application
            AfroBite Resto installée sur un écran dédié. La tablette est un usage opérationnel
            recommandé, pas une variante fonctionnelle distincte.
          </DocCallout>
        </DocTopic>

        <DocTopic id="mobile-restaurant" title="Application mobile restaurant" eyebrow="Gestion mobile">
          <p>
            Sur téléphone, la même application donne accès aux mêmes onglets principaux : vidéos,
            plats, revenus, tableau de bord et profil. Le téléphone convient à la gestion courante
            et au suivi hors du poste de service ; pendant le service, un appareil dédié réduit le
            risque de manquer une alerte.
          </p>
        </DocTopic>

        <DocTopic id="recevoir-commande" title="Recevoir une commande" eyebrow="Alerte active">
          <DocSteps
            items={[
              { title: "Notification", text: "Une nouvelle commande déclenche une notification dédiée et ouvre la vue restaurant appropriée." },
              { title: "Alarme locale", text: "Tant qu’une commande attend une réponse, l’application répète des impulsions sonores et haptiques selon les préférences." },
              { title: "Lecture", text: "Vérifier les articles, quantités, notes, total et mode de récupération avant de répondre." },
              { title: "Réponse", text: "Accepter avec un temps estimé ou refuser avec un motif obligatoire." },
            ]}
          />
          <DocCallout title="Après 5 minutes sans réponse" tone="important">
            La commande reste en attente et l’alarme continue. Le système crée une escalade urgente
            pour le Call Center ; il ne l’expire pas automatiquement à ce jalon.
          </DocCallout>
        </DocTopic>

        <DocTopic id="accepter-refuser" title="Accepter ou refuser" eyebrow="Décision restaurant">
          <DocGrid>
            <DocCard icon={CheckCircle2} title="Accepter">
              Choisir un délai estimé parmi les options proposées. La commande passe en attente du
              paiement du client et apparaît dans les commandes en cours.
            </DocCard>
            <DocCard icon={ListChecks} title="Refuser">
              Sélectionner ou saisir un motif. Le refus clôt cette tentative avant paiement et le
              client en est informé.
            </DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="paiement-confirme" title="Paiement confirmé" eyebrow="Barrière avant cuisine">
          <DocCallout title="Ne pas préparer avant confirmation" tone="important">
            Après l’acceptation, l’écran indique que le client doit encore payer. L’action de
            démarrer la préparation est protégée et ne doit être utilisée que lorsque la commande
            est au statut payé, prête pour préparation.
          </DocCallout>
          <p>
            La confirmation est portée par l’état de la commande, pas par une capture d’écran ou
            une déclaration orale. En cas de doute, ne pas contourner le statut : faire vérifier la
            commande par le support.
          </p>
        </DocTopic>

        <DocTopic id="preparer-commande" title="Préparer la commande" eyebrow="Cuisine">
          <DocSteps
            items={[
              { title: "Contrôler le statut", status: "Payée", text: "Vérifier que le paiement est confirmé et que l’action de préparation est disponible." },
              { title: "Relire les détails", text: "Contrôler quantités, variantes et instructions avant la mise en production." },
              { title: "Démarrer", status: "En préparation", text: "Faire avancer la commande pour que le client et les opérations voient la progression." },
              { title: "Conditionner", text: "Préparer la remise adaptée : livreur pour une livraison, client pour un retrait." },
            ]}
          />
        </DocTopic>

        <DocTopic id="plat-pret" title="Plat prêt" eyebrow="Fin de préparation">
          <p>
            Marquer la commande prête seulement lorsque tout est complet et emballé. En livraison,
            ce statut permet d’aligner la prise en charge du livreur ; en retrait, il informe le
            client que la commande peut être récupérée.
          </p>
        </DocTopic>

        <DocTopic id="remise-livreur" title="Remise au livreur" eyebrow="Livraison uniquement">
          <DocSteps
            items={[
              { title: "Identifier la commande", text: "Comparer la référence et les informations visibles avant toute remise." },
              { title: "Recevoir le code", text: "Le livreur présente son code de récupération à 4 chiffres depuis AfroBite Livreur." },
              { title: "Saisir et valider", text: "Le restaurant saisit le code dans AfroBite Resto. La remise est enregistrée lorsque la validation réussit." },
              { title: "Laisser partir", status: "Récupérée", text: "Le livreur peut alors poursuivre vers le client ; ne pas remettre la commande avant la validation." },
            ]}
          />
        </DocTopic>

        <DocTopic id="retrait-par-client" title="Retrait par le client" eyebrow="Retrait uniquement">
          <p>
            Le client présente son propre code de retrait à 4 chiffres. Le restaurant vérifie la
            référence, saisit le code dans l’écran prévu et remet la commande après validation. Ce
            parcours ne comporte ni attribution de livreur ni étape « en route ».
          </p>
        </DocTopic>

        <DocTopic id="revenus-historique" title="Revenus et historique" eyebrow="Suivi partenaire">
          <DocGrid>
            <DocCard icon={WalletCards} title="Revenus">
              L’onglet Revenus présente les données financières et les éléments de versement
              disponibles pour le compte restaurant.
            </DocCard>
            <DocCard icon={ReceiptText} title="Historique">
              Les vues commandes, activité et statistiques permettent de retrouver les commandes,
              statuts et jalons utiles au suivi du service.
            </DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="videos-catalogue" title="Vidéos et catalogue" eyebrow="Maintenir l’offre">
          <p>
            « Mes plats » gère les articles du restaurant. « Ajouter » sert à publier les vidéos,
            et le tableau de bord comporte aussi des vues plats, vidéos, statistiques et paramètres.
            Avant le service, vérifier la disponibilité et la cohérence des contenus afin d’éviter
            d’accepter un article indisponible.
          </p>
        </DocTopic>
      </DocChapter>

      <DocChapter
        id="livraison"
        number="04"
        label="Livraison"
        title="De l’offre de course à la preuve de livraison"
        lead="AfroBite Livreur guide une course par étapes contrôlées, depuis la mise en ligne jusqu’au code final remis par le client."
      >
        <DocTopic id="livraison-fonctionnement" title="Fonctionnement général" eyebrow="Cycle livreur">
          <DocFlow
            items={[
              { label: "En ligne" },
              { label: "Offre" },
              { label: "Acceptation" },
              { label: "Vers restaurant" },
              { label: "Code de retrait" },
              { label: "Vers client" },
              { label: "Code client" },
            ]}
          />
        </DocTopic>

        <DocTopic id="societe-livraison" title="Société de livraison" eyebrow="Organisation partenaire">
          <p>
            Le dashboard AfroBite permet de gérer des sociétés de livraison, d’y rattacher des
            livreurs et de consulter leur état. La société fournit un cadre partenaire ; chaque
            course reste exécutée par un compte livreur identifié dans AfroBite Livreur. Les outils
            financiers affichés au partenaire dépendent de la configuration visible dans l’admin.
          </p>
        </DocTopic>

        <DocTopic id="afrobite-livreur" title="Application AfroBite Livreur" eyebrow="Outil terrain">
          <DocGrid columns={3}>
            <DocCard icon={MapPin} title="Carte">Position, guidage et course active.</DocCard>
            <DocCard icon={Truck} title="Livraisons">Offres, course en cours et livraisons terminées.</DocCard>
            <DocCard icon={ChartNoAxesCombined} title="Gains">Courses et montants associés.</DocCard>
            <DocCard icon={UserRoundCheck} title="Profil">Compte, disponibilité, avis et accès au support.</DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="mise-en-ligne" title="Mise en ligne" eyebrow="Disponible pour recevoir">
          <p>
            Un livreur approuvé active son statut en ligne pour recevoir des propositions. La
            localisation est alors utilisée pour déterminer les courses pertinentes et alimenter
            le suivi pendant une livraison active. Un compte suspendu ne peut pas opérer ; un
            dossier en attente ne peut pas se mettre en ligne avant validation.
          </p>
        </DocTopic>

        <DocTopic id="attribution-livraison" title="Attribution d’une livraison" eyebrow="Dispatch">
          <p>
            Après paiement d’une commande en livraison, le système recherche des livreurs en ligne
            et disponibles, en tenant compte de leur position. Une offre est présentée à un livreur
            pendant 3 minutes. Si elle expire ou est refusée, la recherche peut continuer ; une
            course sans preneur peut être remontée aux opérations pour attribution manuelle.
          </p>
        </DocTopic>

        <DocTopic id="acceptation-course" title="Acceptation d’une course" eyebrow="Décider avant le départ">
          <DocCard icon={Clock3} title="Informations visibles avant acceptation" tone="gold">
            Restaurant et zones de retrait/livraison, temps estimés, distance lorsqu’elle est
            disponible, heure d’arrivée souhaitée et montant de la course. Un écran de confirmation
            rappelle que l’acceptation engage le livreur.
          </DocCard>
          <p>
            Le livreur peut accepter ou refuser avant expiration. Une fois réclamée avec succès,
            l’offre lui est attribuée et les autres propositions liées à la même course ne sont plus
            disponibles.
          </p>
        </DocTopic>

        <DocTopic id="recuperation-restaurant" title="Récupération au restaurant" eyebrow="Double contrôle">
          <DocSteps
            items={[
              { title: "Naviguer", status: "Vers le restaurant", text: "Suivre le guidage jusqu’au point de retrait indiqué." },
              { title: "Signaler l’arrivée", status: "Au restaurant", text: "Faire progresser la course à l’arrivée." },
              { title: "Présenter le code", text: "Afficher au restaurant le code de récupération à 4 chiffres fourni dans l’application." },
              { title: "Attendre la validation", status: "Récupérée", text: "Le restaurant saisit le code. Tant que ce n’est pas validé, l’application indique d’attendre." },
            ]}
          />
        </DocTopic>

        <DocTopic id="livraison-au-client" title="Livraison au client" eyebrow="Dernier trajet">
          <p>
            Après la récupération confirmée, le livreur navigue vers l’adresse du client. La course
            progresse vers « en route vers le client », puis « arrivé chez le client ». La position
            de la course alimente le suivi visible côté client lorsque les conditions sont réunies.
          </p>
        </DocTopic>

        <DocTopic id="confirmation-livraison" title="Confirmation de livraison" eyebrow="Preuve finale">
          <DocCallout title="Le livreur ne peut pas s’auto-déclarer livré" tone="success">
            À l’arrivée, le client communique un code de confirmation aléatoire à 4 chiffres. Le
            livreur le saisit dans AfroBite Livreur ; seule cette vérification permet la finalisation
            normale de la course.
          </DocCallout>
        </DocTopic>

        <DocTopic id="historique-livreur" title="Historique" eyebrow="Courses terminées">
          <p>
            L’onglet Livraisons affiche la course active et les courses terminées. Le détail d’une
            livraison terminée reprend la référence, le restaurant, la destination, les jalons
            d’acceptation/récupération/livraison, les informations de course et le gain associé.
          </p>
        </DocTopic>
      </DocChapter>

      <DocChapter
        id="operations"
        number="05"
        label="Opérations AfroBite"
        title="Superviser et débloquer"
        lead="Le dashboard administratif regroupe les commandes, partenaires, livraisons, tickets et alertes. Les actions dépendent du rôle et des permissions."
      >
        <DocTopic id="dashboard-admin" title="Dashboard administratif" eyebrow="Vue contrôlée">
          <DocGrid columns={3}>
            <DocCard icon={LayoutDashboard} title="Pilotage">Indicateurs et accès aux modules opérationnels.</DocCard>
            <DocCard icon={ReceiptText} title="Commandes">Liste, filtres, recherche et détail des commandes.</DocCard>
            <DocCard icon={Route} title="Livraisons">Courses actives, attribution et suivi des livreurs disponibles.</DocCard>
            <DocCard icon={Store} title="Partenaires">Restaurants, sociétés de livraison et livreurs.</DocCard>
            <DocCard icon={TicketCheck} title="Tickets">Incidents, commentaires, assignation et résolution.</DocCard>
            <DocCard icon={ShieldCheck} title="Accès">Navigation et actions adaptées au rôle administratif.</DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="supervision-commandes" title="Supervision des commandes" eyebrow="Lire avant d’agir">
          <DocBullets>
            <li>Rechercher par référence et vérifier le statut métier courant.</li>
            <li>Contrôler le statut de paiement séparément de la préparation.</li>
            <li>Identifier le restaurant, le mode livraison/retrait et le livreur éventuellement assigné.</li>
            <li>Comparer les timestamps et l’historique des statuts pour localiser le blocage.</li>
            <li>Pour une livraison sans preneur, utiliser la vue d’attribution et les livreurs disponibles.</li>
          </DocBullets>
        </DocTopic>

        <DocTopic id="support-call-center" title="Support / Call Center" eyebrow="Checklist avant appel">
          <DocSteps
            items={[
              { title: "Commande", text: "Référence, mode de récupération, statut courant et dernier changement." },
              { title: "Paiement", text: "Non payé, en cours, confirmé ou échoué ; ne jamais déduire le paiement du seul statut restaurant." },
              { title: "Restaurant", text: "Nom, contact, réponse et délai estimé. Une absence de réponse après 5 minutes crée une tâche urgente." },
              { title: "Livraison", text: "Présence d’une course, statut de dispatch, livreur assigné et progression terrain." },
              { title: "Chronologie", text: "Création, acceptation, paiement, préparation, retrait et livraison selon les timestamps disponibles." },
              { title: "Incident", text: "Ticket existant, priorité, commentaires et équipe en charge avant de créer un doublon." },
            ]}
          />
          <DocCallout title="Escalade restaurant sans réponse" tone="important">
            La file Call Center reçoit une tâche urgente après 5 minutes sans réponse restaurant.
            La commande et la sonnerie restent actives : l’objectif est d’obtenir une décision, pas
            de supposer une annulation.
          </DocCallout>
        </DocTopic>

        <DocTopic id="gestion-incidents" title="Gestion des incidents" eyebrow="Tickets et traçabilité">
          <p>
            Le module Tickets permet de créer, filtrer, prendre en charge, réassigner, commenter,
            joindre des éléments et clôturer un incident selon les permissions. Les tickets peuvent
            référencer une commande ou un partenaire. Les alertes automatisées, comme une absence
            de réponse restaurant, créent aussi un point de suivi opérationnel.
          </p>
        </DocTopic>

        <DocTopic id="operations-restaurants" title="Restaurants" eyebrow="Administration partenaire">
          <p>
            Les opérations disposent des listes et fiches restaurant, des candidatures, informations
            de compte, états d’approbation et éléments de modération. Avant toute action, vérifier
            l’identité du partenaire, son statut, l’historique pertinent et la commande concernée.
          </p>
        </DocTopic>

        <DocTopic id="operations-livreurs" title="Livreurs" eyebrow="Disponibilité et attribution">
          <p>
            Le dashboard regroupe les livreurs, leur société éventuelle, leur statut d’approbation,
            leur disponibilité et les courses. La vue d’attribution affiche les commandes sans
            livreur et les profils disponibles afin que le Call Center puisse assigner une course
            lorsque la recherche automatique n’aboutit pas.
          </p>
        </DocTopic>
      </DocChapter>

      <DocChapter
        id="technique"
        number="06"
        label="Technique"
        title="Une vue d’ensemble, sans données sensibles"
        lead="Cette section donne aux nouveaux développeurs les frontières du système. Les détails d’exploitation, secrets et contrôles internes restent dans la documentation privée."
      >
        <DocTopic id="architecture" title="Architecture générale" eyebrow="Composants publics">
          <div className="doc-architecture" aria-label="Architecture AfroBite à haut niveau">
            <div><Smartphone size={24} /><strong>AfroBite User</strong><span>Flutter / Dart</span></div>
            <div><Store size={24} /><strong>AfroBite Resto</strong><span>Flutter / Dart</span></div>
            <div className="doc-architecture-core"><Database size={26} /><strong>Services AfroBite</strong><span>Services cloud et données temps réel</span></div>
            <div><Bike size={24} /><strong>AfroBite Livreur</strong><span>Flutter / Dart</span></div>
            <div><LayoutDashboard size={24} /><strong>Admin</strong><span>Next.js / React</span></div>
          </div>
          <p>
            Les trois applications mobiles partagent des modèles et services communs, tout en ayant
            des points d’entrée et des expériences dédiés. Les services backend orchestrent les
            états de commande, notifications, paiements et courses. Le dashboard et le site public
            sont des applications web Next.js distinctes.
          </p>
        </DocTopic>

        <DocTopic id="applications" title="Applications AfroBite" eyebrow="Cinq surfaces">
          <DocGrid>
            <DocCard icon={Smartphone} title="AfroBite User">Découverte, commande, paiement et suivi client.</DocCard>
            <DocCard icon={Store} title="AfroBite Resto">Catalogue, contenus, commandes et revenus restaurant.</DocCard>
            <DocCard icon={Bike} title="AfroBite Livreur">Offres, guidage, validations et historique terrain.</DocCard>
            <DocCard icon={LayoutDashboard} title="Dashboard Admin">Supervision et outils internes avec contrôle d’accès.</DocCard>
            <DocCard icon={BookOpenCheck} title="Site public">Présentation, support, informations légales et cette documentation.</DocCard>
          </DocGrid>
        </DocTopic>

        <DocTopic id="environnements" title="Environnements" eyebrow="Séparer les usages">
          <p>
            Le dépôt distingue les builds mobiles par application, les services backend, le
            dashboard administratif et le site public. Chaque changement doit être vérifié dans le
            contexte concerné avant publication. Les identifiants de projets, clés, URLs privées,
            règles complètes et paramètres de paiement ne font pas partie de cette documentation.
          </p>
          <DocCallout title="Documentation interne requise" tone="private">
            Les procédures de déploiement, configurations sensibles, accès, gestion d’incident
            détaillée et paramètres fournisseurs doivent rester dans un espace interne protégé.
          </DocCallout>
        </DocTopic>

        <DocTopic id="principes-developpeurs" title="Principes importants pour les développeurs" eyebrow="Garde-fous">
          <DocGrid>
            <DocCard icon={Code2} title="Respecter les machines d’état">
              Utiliser les transitions métier existantes ; ne pas modifier directement un statut
              pour contourner une validation.
            </DocCard>
            <DocCard icon={CreditCard} title="Séparer acceptation et paiement">
              Une commande acceptée par le restaurant reste non préparée jusqu’à confirmation du paiement.
            </DocCard>
            <DocCard icon={PackageCheck} title="Conserver les preuves de remise">
              Les parcours de retrait et livraison ont des validations distinctes qui ne doivent pas être fusionnées.
            </DocCard>
            <DocCard icon={UsersRound} title="Isoler les rôles">
              Chaque application et action doit rester limitée à l’acteur autorisé.
            </DocCard>
            <DocCard icon={Radio} title="Prévoir le temps réel et la reprise">
              Les interfaces observent les changements ; les opérations réseau doivent tolérer les reprises et doublons.
            </DocCard>
            <DocCard icon={ShieldCheck} title="Ne jamais exposer les secrets">
              Garder clés, endpoints privés, règles détaillées et logique de sécurité hors du client et du site public.
            </DocCard>
          </DocGrid>
        </DocTopic>
      </DocChapter>
    </>
  );
}

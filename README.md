# Cinéscope – Séance 3 : accessibilité du formulaire de réservation

## Membres

- raphael.vazzano
- leo.menaldo

## Tests :

Côté tests, les deux tests à compléter de Socle.test ont été écrits : envoi d'un formulaire vide avec vérification de aria-invalid et de la description du champ email, puis vérification que le résumé d'erreurs reçoit le focus. Un test supplémentaire (Reservation.test) contrôle que l'email est décrit par son aide puis par son erreur. Les 5 tests passent.

## Constats

### Champs sans étiquette :

"Nom de réservation" et "Adresse électronique" étaient de simples paragraphes, non reliés aux champs. Nous les avons remplacés par de vrais labels.

### Boutons radio sans groupe :

"Type de place" était un paragraphe et les options n'avaient pas de label. Nous avons utilisé un fieldset avec une legend, et un label par option.

### Erreurs invisibles pour les lecteurs d'écran :

Seule une bordure rouge et un message générique ("Certains champs sont incorrects") signalaient un problème, alors que les messages précis existaient déjà dans le code de validation. Nous affichons maintenant le message de chaque champ, avec aria-invalid et aria-describedby (aide, puis erreur).

### Pas de résumé d'erreurs :

Après un envoi invalide, le focus restait sur le bouton. Nous avons ajouté un résumé au-dessus du formulaire, qui prend le focus et contient un lien vers chaque champ en erreur.

### Message d'erreur mal placé :

Dans un premier temps, il était entre l'aide et le champ. Nous l'avons déplacé après le champ, pour garder l'ordre libellé, aide, champ, erreur.

## Justification

### Labels et fieldset/legend :

Ce sont les éléments natifs HTML, plus fiables que de l'ARIA. Le label donne son nom au champ et agrandit la zone de clic ; la legend donne leur contexte aux radios. Le placeholder ne remplace pas un label car il disparaît à la saisie.

### aria-invalid et aria-describedby :

la couleur seule ne suffit pas à signaler une erreur. Le lecteur d'écran annonce que le champ est invalide et pourquoi, en plus de l'aide. aria-invalid n'est mis qu'en cas d'erreur, pour ne pas annoncer "invalide" sur un champ encore vide.

### Résumé d'erreurs avec focus :

la validation se fait à l'envoi (formulaire en noValidate), donc rien n'est annoncé si le focus ne bouge pas. Le résumé donne une vue d'ensemble et ses liens mènent directement au champ à corriger.

### Erreur après le champ :

l'aide sert à remplir, l'erreur sert à corriger. Garder le champ juste après son libellé évite de couper le contexte, et l'ordre de lecture correspond à l'ordre visuel.

### Tests par rôle et description accessible :

nous testons ce que perçoit un utilisateur de technologie d'assistance (nom accessible, description, focus) et non la structure interne du DOM. Si un label ou un aria-describedby disparaît, un test échoue, ce qui évite les régressions.

/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { WebView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import BlockTemplate from '../../components/BlockTemplate';
import { beautifyDateTime } from '../../utils';
import { _, Terms as t } from '../../utils/i18n';
import { Config } from '../../redux/actions';
import colors from '../../styles/colors';

export const TERMS_VERSION = 1;

const TERMS = `En vigueur à la publication de l’application le 1er Juillet 2019.

Les présentes conditions générales d’utilisation (dites « CGUs ») ont pour objet l’encadrement juridique des modalités de mise à disposition de l’application et des services, de définir les conditions d’accès et d’utilisation des services par l’utilisateur.
Les présentes CGUs sont accessibles via l’application mobile.
Toute inscription ou utilisation de l’application implique l’acceptation sans aucune réserve ni restriction des présentes CGUs par l’utilisateur.
En cas de non-acceptation des CGUs stipulées dans le présent contrat, l’utilisateur se doit de renoncer à l’accès aux services proposés par l'application.

	1. Contact
L’édition et la direction de la publication de l’application mobile PayUTC est la Bureau des Etudiants de l’Université de Technologie de Compiègne (dit « BDE-UTC ») dont le siège est situé au Rue du Docteur Schweitzer CS 60319. La prise de contact peut être réalisée avec le numéro de téléphone : +33 3 44 23 43 85 ou l’adresse email suivante : bde@assos.utc.fr.
Le directeur de publication est le président du Service Informatique de la Maison des Etudiants (dit « SiMDE »), commission conventionnée par le BDE-UTC. La prise de contact peut être réalisée avec le numéro de téléphone : +33 3 44 23 43 85 ou l’adresse email suivante : simde@assos.utc.fr.

	2. Mentions légales
L’éditeur de l’application est le SiMDE. Cette commission assure la maintenabilité et la sécurité de l’application ainsi que la gestion de tickets et de demandes réalisés à l'adresse email suivante: payutc@assos.utc.fr.

	3. Présentation des services de l’application
Le présent contrat régit votre utilisation des services de l’application mobile du BDE-UTC, par le biais desquels vous pouvez consulter votre solde PayUTC (service de paiement utilisé au sein de la fédération BDE-UTC), recharger votre compte via une interface de paiement en ligne sécurisé, transférer à une autre personne une partie ou la totalité de votre solde, obtenir et gérer des statistiques et données relatives à votre activité et votre compte PayUTC.

	4. Accès à l’application
L’application mobile est accessible via téléchargement sur github.com/simde-utc/payutc-mobile ou via téléchargement sur les plateformes officielles Google Play et Apple Store.
L’application propose un ensemble de service présenté dans l’article 3 de ce document.
L’application est accessible gratuitement en tout lieu à tout utilisateur ayant un accès à Internet. Tous les frais supportés par l’utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à son entière charge.
L’utilisateur non membre n’a accès qu’à une partie restreinte de l’application. Pour s’affranchir de ces restrictions et accéder aux services, l’utilisateur doit ensuite s’identifier à l’aide de son identifiant et de son mot de passe lui permettant de s'authentifier au service PayUTC ou CAS-UTC.
Tout utilisateur membre inscrit pourra également solliciter sa désinscription en rédigeant un courriel à joindre à l’adresse mail de la direction des systèmes d’information de l’UTC : payutc@assos.utc.fr.
Seuls les utilisateurs membres du réseau privé de l’université de technologie de Compiègne ont accès sans aucune restriction particulière au contenu de l’application.
L’éditeur s’efforce de permettre l’accès aux fonctionnalités de l’application 24 heures sur 24, 7 jours sur 7, sauf en cas d’événements de force majeure ayant pour conséquence un dysfonctionnement de l’application ou serveur et sous réserve de toute interruption ou modification en cas de maintenance des services de l’application. Dans ces cas, l’utilisateur accepte ainsi à ne pas tenir rigueur à l’éditeur de toute interruption ou suspension de service, même sans préavis.

	5. Collecte des données
L’application assure à l'utilisateur une collecte et un traitement d'informations personnelles dans le respect de la vie privée conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés.
En vertu de la loi informatique et Liberté, en date du 6 janvier 1978, l'utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition de ses données personnelles.

	6. Propriété intellectuelle
Les marques, logos, signes et contenus (textes, images, son…) présentés dans l’application font l’objet d’une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d’auteur.
L’utilisateur doit solliciter l’autorisation préalable de l'application pour toute reproduction, publication, copie des différents contenus. Il s’engage à une utilisation des contenus de l'application dans un cadre strictement privé, toute utilisation à des fins commerciales et publicitaires est strictement interdite.
Toute représentation totale ou partielle de l’application par quelque procédé que ce soit, sans l’autorisation expresse de l’exploitant de l’application constituerait une contrefaçon sanctionnée par l’article L 335-2 et suivants du Code de la propriété intellectuelle.
Il est rappelé conformément à l’article L122-5 du Code de propriété intellectuelle que l’utilisateur qui reproduit, copie ou publie le contenu protégé doit citer l’auteur et sa source.
De plus, le code étant sous la licence GNU GPL-3.0, toute utilisation partielle ou totale du code permettant le développement de cette application implique l'utilisation de la même licence pour le projet source.

	7. Responsabilité
Les sources des informations diffusées sur l’application sont réputées fiables, mais l’application ne garantit pas qu’il soit exempt de défauts, d’erreurs ou d’omissions.
Les informations communiquées sont présentées à titre indicatif et générales sans valeur contractuelle. Malgré des mises à jour régulières, l’application ne peut être tenue responsable de la modification des dispositions administratives et juridiques survenant après la publication. De même, l’application ne peut être tenue responsable de l’utilisation et de l’interprétation de l’information qu’elle contient.
L’utilisateur s’assure de garder son mot de passe secret. Toute divulgation du mot de passe, quelle que soit sa forme, est interdite. Il assume les risques liés à l’utilisation de son identifiant et mot de passe. L’application décline toute responsabilité.
L’application ne peut être tenue responsable d’éventuels virus qui pourraient infecter l’appareil mobile ou tout autre matériel informatique de l’utilisateur, suite à une utilisation, à l’accès, ou au téléchargement provenant de l’application.

	8. Liens hypertextes
Des liens hypertextes peuvent être présents sur l’application. L’utilisateur est informé qu’en cliquant sur ses liens, il sortira de l’application. Cette dernière n’a pas de contrôle sur les pages Web sur lesquelles aboutissent ses liens et ne saurait, en aucun cas, être responsable de leur contenu.

	9. Modification des CGUs
Le BDE-UTC et le SiMDE se réservent le droit de mettre à jour et de modifier les présentes CGUs en mettant en ligne les CGUs telles que modifiées. Les CGUs entrent directement en application dès leur mise en ligne sur l’application.
L'utilisateur sera informé de ces modifications lors de la mise à jour de son application.

	10. Droit applicable et juridiction compétente
La législation française s’applique au présent contrat. En cas d’absence de résolution amiable d’un litige entre les parties, les tribunaux français seront seuls compétents pour en connaître.
Pour toute question relative à l’application des présentes CGUs, vous pouvez joindre l’éditeur aux coordonnées inscrites à l’Article 1.
`;

class TermsScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 1, borderBottomColor: colors.backgroundLight },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
		headerTruncatedBackTitle: _('back'),
	});

	validate() {
		const { navigation, dispatch } = this.props;

		dispatch(
			Config.terms({
				version: TERMS_VERSION,
				date: Date.now(),
			})
		);

		if (navigation.getParam('quick')) {
			navigation.goBack();
		}
	}

	render() {
		const {
			terms: { version, date },
		} = this.props;
		const validated = version === TERMS_VERSION;

		return (
			<View style={{ flex: 1 }}>
				<WebView
					style={{ backgroundColor: 'transparent' }}
					source={{
						html: `<p style='font-family: sans-serif; text-align: justify; white-space: pre-wrap;'>${TERMS}</p>`,
					}}
				/>
				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					customBackground={validated ? colors.more : colors.primary}
					disabled={validated}
					style={{ margin: 5 }}
					onPress={() => this.validate()}
				>
					<Text
						style={{
							fontSize: 18,
							fontWeight: 'bold',
							textAlign: 'center',
							color: colors.backgroundBlock,
						}}
					>
						{validated ? t('validated', { date: beautifyDateTime(date) }) : t('accept')}
					</Text>
				</BlockTemplate>
			</View>
		);
	}
}

const mapStateToProps = ({ config: { terms } }) => ({ terms });

export default connect(mapStateToProps)(TermsScreen);

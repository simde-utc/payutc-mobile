/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import List from '../../components/List';
import Paragraphe from '../../components/Paragraphe';
import Contributor from '../../components/Contributors/Contributor';
import colors from '../../styles/colors';
import { GitHub } from '../../redux/actions';
import { _, Contributors as t } from '../../utils/i18n';
import {
	CONTRIBUTORS_MAIN_TEAM,
	CONTRIBUTORS_DESIGN_TEAM,
	CONTRIBUTORS_BLACKLIST,
} from '../../../config';

const mainTeamKeys = Object.keys(CONTRIBUTORS_MAIN_TEAM);
const designTeamKeys = Object.keys(CONTRIBUTORS_DESIGN_TEAM);

class ContributorsScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
		headerTruncatedBackTitle: _('back'),
	});

	constructor(props) {
		super(props);

		this.renderContributor = this.renderContributor.bind(this);
	}

	componentDidMount() {
		const { dispatch } = this.props;

		dispatch(GitHub.getContributors());

		mainTeamKeys.map(login => this.fetchGithubUser(login));
		designTeamKeys.map(login => this.fetchGithubUser(login));
	}

	componentDidUpdate(prevProps) {
		const { contributors, contributorsFetched } = this.props;

		if (!prevProps.contributorsFetched && contributorsFetched) {
			contributors.map(({ login }) => this.fetchGithubUser(login));
		}
	}

	onRefresh() {
		const { dispatch } = this.props;

		dispatch(GitHub.getContributors());
	}

	getContributors() {
		const { contributors } = this.props;

		return contributors
			.filter(({ login }) => !CONTRIBUTORS_BLACKLIST.includes(login))
			.map(({ id, login, contributions, avatar_url, html_url }) => ({
				id,
				login,
				description: t('contributions', { count: contributions }),
				avatar_url,
				html_url,
			}));
	}

	static getMainTeam() {
		return mainTeamKeys.map(login => ({
			login,
			description: t(CONTRIBUTORS_MAIN_TEAM[login]),
		}));
	}

	static getDesignTeam() {
		return designTeamKeys.map(login => ({
			login,
			description: t(CONTRIBUTORS_DESIGN_TEAM[login]),
		}));
	}

	fetchGithubUser(login) {
		const { dispatch } = this.props;

		dispatch(GitHub[`getUser#${login}`]());
	}

	renderContributor({ login, description, avatar_url, html_url }, index, last) {
		const { github } = this.props;
		const data = github[`getUser#${login}`]().getData({});

		return (
			<Contributor
				name={data.name || login}
				subname={data.name ? login : null}
				description={description}
				picture={avatar_url || data.avatar_url}
				url={html_url || data.html_url}
				backgroundColor={index % 2 === 0 ? colors.backgroundBlockAlt : colors.backgroundBlock}
				roundedBottom={last}
			/>
		);
	}

	render() {
		const { contributorsFetching } = this.props;

		return (
			<ScrollView
				style={{ backgroundColor: colors.backgroundLight }}
				refreshControl={
					<RefreshControl
						refreshing={contributorsFetching}
						onRefresh={() => this.onRefresh()}
						colors={[colors.secondary]}
						tintColor={colors.secondary}
					/>
				}
			>
				<View style={{ padding: 15 }}>
					<Paragraphe
						title={t('developped')}
						description={t('developped_desc')}
						titleColor={colors.transfer}
					/>
					<View style={{ height: 15 }} />
					<List
						title={t('main_team')}
						items={ContributorsScreen.getMainTeam()}
						loading={contributorsFetching}
						keyExtractor={({ login }) => login}
						renderItem={this.renderContributor}
					/>
					<View style={{ height: 15 }} />
					<List
						title={t('design_team')}
						items={ContributorsScreen.getDesignTeam()}
						keyExtractor={({ login }) => login}
						renderItem={this.renderContributor}
					/>
					<View style={{ height: 15 }} />
					<List
						title={t('contributors')}
						items={this.getContributors()}
						keyExtractor={({ id }) => id.toString()}
						renderItem={this.renderContributor}
					/>
				</View>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ github }) => {
	const contributors = github.getContributors();

	return {
		github,
		contributors: contributors.getData([]),
		contributorsFetching: contributors.isFetching(),
		contributorsFetched: contributors.isFetched(),
	};
};

export default connect(mapStateToProps)(ContributorsScreen);

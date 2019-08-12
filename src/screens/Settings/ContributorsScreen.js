/**
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import List from '../../components/List';
import Paragraphe from '../../components/Paragraphe';
import Contributor from '../../components/Contributors/Contributor';
import colors from '../../styles/colors';
import { GitHub } from '../../redux/actions';
import { Contributors as t } from '../../utils/i18n';

class ContributorsScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerForceInset: { top: 'never' },
		headerTintColor: colors.primary,
	});

	componentDidMount() {
		const { dispatch } = this.props;

		dispatch(GitHub.getContributors());
	}

	componentDidUpdate(prevProps) {
		const { contributors, contributorsFetching, dispatch } = this.props;

		if (prevProps.contributorsFetching && !contributorsFetching) {
			dispatch(GitHub.getUsers(contributors.map(({ login }) => login)));
		}
	}

	renderContributor({ login, contributions, avatar_url, html_url }, index, last) {
		const { users } = this.props;
		console.log(users);
		return (
			<Contributor
				name={login}
				description={t('contributions', { count: contributions })}
				picture={avatar_url}
				url={html_url}
				backgroundColor={index % 2 === 0 ? colors.backgroundBlockAlt : colors.backgroundBlock}
				roundedBottom={last}
			/>
		);
	}

	render() {
		const { contributors, contributorsFetching } = this.props;

		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight, padding: 15 }}>
				<Paragraphe
					title={t('developped')}
					description={t('developped_desc')}
					titleColor={colors.transfer}
				/>
				<View style={{ height: 15 }} />
				<List
					title={t('contributors')}
					items={contributors}
					loading={contributorsFetching}
					keyExtractor={({ id }) => id.toString()}
					renderItem={this.renderContributor.bind(this)}
				/>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ github }) => {
	const contributors = github.getContributors();

	return {
		users: github.getUsers().getData([]),
		contributors: contributors.getData([]),
		contributorsFetching: contributors.isFetching(),
	};
};

export default connect(mapStateToProps)(ContributorsScreen);

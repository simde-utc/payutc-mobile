/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Stats as t } from '../../utils/i18n';
import colors from '../../styles/colors';
import BlockTemplate from '../../components/BlockTemplate';
import DataBlockTemplate from '../../components/Stats/DataBlockTemplate';

class StatsScreen extends React.PureComponent {
	static navigationOptions = {
		title: t('title'),
		header: null,
		headerForceInset: { top: 'never' },
	};

	render() {
		return (
			<ScrollView
				style={{ backgroundColor: colors.backgroundLight, padding: 15 }}
			>
				<BlockTemplate roundedTop roundedBottom shadow>
					<Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary }}>
						{t('title')}
					</Text>
				</BlockTemplate>
			</ScrollView>
		)
	}
}

const mapStateToProps = ({ payutc }) => {
	const history = payutc.getHistory();

	return {
		history: history.getData({ historique: [] }).historique,
		historyFetching: history.isFetching(),
		historyFetched: history.isFetched(),
	};
};

export default connect(mapStateToProps)(StatsScreen);

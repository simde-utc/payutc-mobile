/**
 * @author Aymeric Obled <aymeric.obled@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PinForm from '../../components/ChangePin/PinForm';
import Submit from '../../components/ChangePin/Submit';
import Paragraphe from '../../components/Paragraphe';
import colors from '../../styles/colors';
import { _, ChangePin as t } from '../../utils/i18n';

class ChangePinScreen extends React.Component {
	static navigationOptions = () => ({
		title: t('title'),
		headerStyle: { borderBottomWidth: 0 },
		headerTintColor: colors.transfer,
		headerForceInset: { top: 'never' },
		headerTruncatedBackTitle: _('back'),
	});

	constructor(props) {
		super(props);

		this.state = {
			pin: '',
		};

		this.handlePinChange = this.handlePinChange.bind(this);
	}

	handlePinChange(text) {
		this.setState({ pin: text });
	}

	isButtonDisabled() {
		const { pin } = this.state;
		return !(pin.length === 4);
	}

	render() {
		const { navigation, suggestionsFetching, history, historyFetching } = this.props;
		const { pin } = this.state;

		return (
			<ScrollView style={{ backgroundColor: colors.backgroundLight }}>
				<View style={{ padding: 15 }}>
					<Paragraphe
						title={t('pin_description_title')}
						description={t('pin_description')}
						titleColor={colors.transfer}
					/>
				</View>
				<View style={{ padding:15, paddingTop: 0 }}>
					<PinForm pin={pin} onChange={this.handlePinChange} />
				</View>
				<View style={{ padding:15, paddingTop: 0 }}>
					<Submit pin={pin} disabled={this.isButtonDisabled()} navigation={navigation} />
				</View>
			</ScrollView>
		);
	}
}

const mapStateToProps = ({ payutc }) => {
	const suggestions = payutc.getUserAutoComplete();
	const history = payutc.getHistory();

	return {
		suggestions: suggestions.getData([]),
		suggestionsFetching: suggestions.isFetching(),
		history: history.getData({ historique: [] }).historique,
		historyFetching: history.isFetching(),
	};
};

export default connect(mapStateToProps)(ChangePinScreen);
